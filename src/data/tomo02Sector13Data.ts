// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 13: INSTALAR, REINSTALAR Y RECUPERAR WINDOWS // INSTALACIÓN, REINSTALACIÓN Y RECUPERACIÓN

export type RiskLevelSector13 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector13Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetStage: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector13;
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
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
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

export interface Sector13MiniCase {
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

export interface Sector13TestQuestion {
  id: string;
  questionNumber: number;
  category: 'MEDIOS_Y_DESPLIEGUE' | 'METODOS_REINSTALACION' | 'POST_INSTALACION_Y_DRIVERS' | 'WINRE_VSS_RECUPERACION';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_13_INVESTIGATIONS: Sector13Investigation[] = [
  {
    id: 'sec-13-01',
    code: '13.01',
    title: 'ISO oficial',
    subtitle: 'La anatomía de la imagen: install.wim vs install.esd, boot.wim y verificación SHA-256',
    targetStage: 'Media Creation / Windows Image Packaging',
    commandName: 'dism /Get-WimInfo /WimFile:install.wim',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Una imagen ISO de Windows no es un simple archivo comprimido: contiene dos sistemas operativos completos e independientes encapsulados en formatos de imagen de archivos WIM.',
      mythVsTruth: {
        mentira: 'Cualquier ISO descargada de foros o páginas no oficiales es idéntica a la de Microsoft si dice "Windows 11 Pro".',
        verdad: 'Las ISOs oficiales de Microsoft poseen firmas digitales y hashes criptográficos SHA-256 inmutables. Modificaciones no autorizadas suelen inyectar malware en el almacén de componentes WinSxS.',
        comprobalo: 'Ejecutá Get-FileHash -Algorithm SHA256 sobre la ISO y comparalo con el catálogo público de hashes de Microsoft TechNet.',
      },
    },
    entende: {
      queEs: 'Una réplica binaria sector por sector del sistema de archivos UDF/ISO 9660 que aloja el medio de instalación oficial.',
      paraQueSirve: 'Provee los contenedores boot.wim (el entorno WinPE de instalación) e install.wim o install.esd (la imagen del sistema operativo final que se desplegará en el disco de destino).',
      quePasaSiFalta: 'Si la ISO descargada está corrupta o incompleta, el instalador fallará en la fase del 45% con el error 0x8007025D (ERROR_BAD_COMPRESSION_BUFFER).',
    },
    interactua: {
      cliExample: 'dism /Get-WimInfo /WimFile:D:\\sources\\install.wim',
      psExample: 'Get-WindowsImage -ImagePath "D:\\sources\\install.wim"',
      syntaxBreakdown: 'dism /Get-WimInfo interroga la cabecera XML interna del archivo WIM para listar todas las ediciones contenidas (Home, Pro, Enterprise, etc.) con sus índices numéricos.',
      whatToLookFor: 'Índice de la edición deseada (por ejemplo, Index: 6 - Windows 11 Pro) y arquitectura (x64).',
      technicalMetrics: 'Formato: WIM (LZX compression) o ESD (LZMS highly-compressed).',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no invasiva.',
      safetyWarning: 'Verificá siempre el hash SHA-256 antes de crear un pendrive de despliegue en entornos de producción.',
    },
    evidenceBadge: {
      code: 'OFFICIAL_ISO_01',
      label: 'WIM / ESD CORE'
    }
  },
  {
    id: 'sec-13-02',
    code: '13.02',
    title: 'USB booteable',
    subtitle: 'Creación del medio: Rufus, MCT, Ventoy, esquema GPT/FAT32 y Secure Boot',
    targetStage: 'Bootable USB Flash Media',
    commandName: 'rufus / MediaCreationTool.exe',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Crear un USB booteable para UEFI moderno no requiere software especial: basta con formatear el pendrive en FAT32 y descomprimir los archivos de la ISO dentro.',
      mythVsTruth: {
        mentira: 'Un pendrive booteable siempre debe formatearse en NTFS para que Windows lo reconozca.',
        verdad: 'Las especificaciones UEFI de la gran mayoría de motherboards solo reconocen nativamente el sistema de archivos FAT32 para arrancar. Si el archivo install.wim supera los 4 GB, se divide con DISM /Split-Image o se usa el driver UEFI:NTFS.',
        comprobalo: 'Inspeccioná el esquema de partición de un pendrive creado con Media Creation Tool: verás una partición activa formateada estrictamente en FAT32.',
      },
    },
    entende: {
      queEs: 'Una unidad USB configurada con un sector de arranque UEFI y la jerarquía estándar de directorios /EFI/BOOT/BOOTX64.EFI.',
      paraQueSirve: 'Permite arrancar la máquina física en frío para iniciar el asistente de instalación antes de que cargue el sistema operativo del disco interno.',
      quePasaSiFalta: 'Si el pendrive se graba en esquema MBR cuando la motherboard está en modo UEFI puro (CSM desactivado), la unidad no aparecerá en el menú de booteo (F12/F11).',
    },
    interactua: {
      cliExample: 'dism /Split-Image /ImageFile:install.wim /SWMFile:install.swm /FileSize:3800',
      psExample: 'Get-Disk | Where-Object BusType -eq "USB" | Get-Partition',
      syntaxBreakdown: '/Split-Image fragmenta un archivo install.wim de 5 GB en partes .swm de menos de 4 GB para permitir su alojamiento en FAT32 compatible con UEFI.',
      whatToLookFor: 'Presencia del binario \\EFI\\BOOT\\bootx64.efi firmado con certificado de Microsoft para Secure Boot.',
      technicalMetrics: 'Firma Secure Boot: Microsoft Windows Production PCA 2011.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura segura.',
      safetyWarning: 'La creación de un USB booteable formatea y destruye todos los datos existentes en la unidad flash seleccionada.',
    },
    evidenceBadge: {
      code: 'BOOTABLE_USB_02',
      label: 'UEFI USB LOADER'
    }
  },
  {
    id: 'sec-13-03',
    code: '13.03',
    title: 'UEFI install',
    subtitle: 'Arranque nativo UEFI x64: desactivación de CSM y esquema GPT mandatorio',
    targetStage: 'UEFI Firmware Hand-off to Windows Setup',
    commandName: 'bcdedit /enum {current} | findstr path',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Cuando arrancás en modo UEFI puro, el BIOS de 16 bits no interviene en ningún momento: el firmware de 64 bits de la placa madre salta directamente a bootx64.efi.',
      mythVsTruth: {
        mentira: 'Activar CSM (Compatibility Support Module) en el BIOS mejora la estabilidad de Windows 10 y 11.',
        verdad: 'CSM emula un BIOS legacy anticuado. Activar CSM inhabilita funciones de seguridad esenciales como Secure Boot, DirectStorage y la protección de integridad de memoria HVCI.',
        comprobalo: 'Ejecutá "msinfo32" en Windows y comprobá que "Modo de BIOS" diga "UEFI" y "Estado de arranque seguro" diga "Activada".',
      },
    },
    entende: {
      queEs: 'El protocolo estándar de inicialización de plataforma unificado de 64 bits que gestiona la comunicación entre el firmware y el sistema operativo.',
      paraQueSirve: 'Garantiza arranque rápido, compatibilidad con tablas GPT, validación de certificados de drivers previos al kernel y arranque seguro.',
      quePasaSiFalta: 'Si instalás Windows en modo Legacy/CSM, Windows 11 no permitirá actualizarse en el futuro y te impedirá usar funciones como BitLocker con enlace seguro PCR.',
    },
    interactua: {
      cliExample: 'powershell "Get-ItemPropertyValue -Path \'HKLM:\\System\\CurrentControlSet\\Control\\SecureBoot\\State\' -Name UEFISecureBootEnabled"',
      psExample: 'Confirm-SecureBootUEFI',
      syntaxBreakdown: 'Confirm-SecureBootUEFI devuelve $True si la plataforma arrancó bajo UEFI nativo con firmas de Secure Boot aplicadas.',
      whatToLookFor: 'Resultado: True. Path del loader: \\Windows\\system32\\winload.efi (y no winload.exe de legacy).',
      technicalMetrics: 'Loader path: winload.efi (x64 PE32+ executable).',
    },
    alertaEVO: {
      reversibilityRule: 'Solo lectura de telemetría de plataforma.',
      safetyWarning: 'Cambiar de CSM a UEFI puro en el BIOS de una instalación MBR existente impedirá arrancar hasta convertir el disco con mbr2gpt.',
    },
    evidenceBadge: {
      code: 'UEFI_NATIVE_03',
      label: 'UEFI SECURE BOOT'
    }
  },
  {
    id: 'sec-13-04',
    code: '13.04',
    title: 'Clean install',
    subtitle: 'Instalación limpia desde cero: eliminación de particiones y creación del cuarteto GPT',
    targetStage: 'Windows Setup Partitioning Phase',
    commandName: 'setup.exe / diskpart clean',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'La verdadera instalación limpia no es darle clic a "Siguiente": es borrar todas las particiones del disco del sistema hasta dejarlo como "Espacio sin asignar" y permitir a Windows crear su cuarteto estándar.',
      mythVsTruth: {
        mentira: 'Para hacer una instalación limpia hay que formatear manualmente cada partición una por una en el instalador.',
        verdad: 'Formatear manualmente conserva particiones EFI o de recuperación antiguas desalineadas o con malware. Lo correcto es presionar "Eliminar" en cada una hasta que quede un único bloque de espacio sin asignar.',
        comprobalo: 'Al seleccionar espacio sin asignar y pulsar "Siguiente", Windows crea automáticamente: 1) Partición de recuperación (Recovery), 2) Partición EFI (ESP), 3) Partición MSR (16 MB) y 4) Partición primaria C:.',
      },
    },
    entende: {
      queEs: 'El despliegue del sistema operativo en un disco completamente desprovisto de configuraciones, archivos residuales o registros de versiones previas.',
      paraQueSirve: 'Elimina al 100% cualquier virus persistente en el sector de arranque, controladores corruptos, conflictos de servicios huérfanos y degradación histórica del Registro.',
      quePasaSiFalta: 'Si se reinstala encima sin eliminar particiones previas, Windows genera carpetas Windows.old y hereda configuraciones y tablas de arranque viciadas.',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> clean -> convert gpt',
      psExample: 'Get-Partition -DiskNumber 0 | Select PartitionNumber, Type, Size, Offset',
      syntaxBreakdown: 'El instalador ejecuta internamente las APIs de IOCTL para estructurar el disco según la especificación recomendada por Microsoft.',
      whatToLookFor: 'Cuarteto GPT: Recovery (~650 MB), System EFI (100 MB), Reserved MSR (16 MB) y Primary OS (el resto).',
      technicalMetrics: 'Estructura estándar de 4 particiones en discos GPT para Windows 10/11.',
    },
    alertaEVO: {
      reversibilityRule: 'DESTRUCTIVO: Borra todos los datos contenidos en las particiones eliminadas.',
      safetyWarning: 'Respaldá todos tus datos en una unidad externa física antes de proceder con una instalación limpia.',
    },
    evidenceBadge: {
      code: 'CLEAN_INSTALL_04',
      label: 'ZERO STATE INSTALL'
    }
  },
  {
    id: 'sec-13-05',
    code: '13.05',
    title: 'Reset This PC',
    subtitle: 'El motor systemreset.exe: recreación del sistema operativo mediante WIM local o Cloud',
    targetStage: 'Windows Push-Button Reset Engine (PBR)',
    commandName: 'systemreset.exe / reagentc /info',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: '"Restablecer este equipo" no necesita un pendrive de instalación: utiliza los paquetes canónicos de la tienda de componentes local (WinSxS) o descarga una imagen limpia desde los servidores de Microsoft (Cloud Download).',
      mythVsTruth: {
        mentira: 'Restablecer este equipo es exactamente lo mismo que hacer una instalación limpia desde USB.',
        verdad: 'Si el almacén de componentes o el entorno WinRE ya estaban dañados o infectados, un "Reset" local heredará los mismos archivos corruptos. La instalación desde USB es la única garantía absoluta de integridad.',
        comprobalo: 'Ejecutá "systemreset -cleanpc" para iniciar el asistente nativo de reinstalación desatendida de Windows.',
      },
    },
    entende: {
      queEs: 'La característica Push-Button Reset (PBR) introducida para permitir a los usuarios reinstalar Windows sin requerir medios de instalación externos.',
      paraQueSirve: 'Soluciona inestabilidades graves del sistema operativo restableciendo los binarios de Windows a su estado original de fábrica.',
      quePasaSiFalta: 'Si la partición de recuperación está desactivada o winre.wim falta, "Restablecer este equipo" fallará con el mensaje "No se pudo encontrar el entorno de recuperación".',
    },
    interactua: {
      cliExample: 'systemreset -factoryreset',
      psExample: 'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushUX" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'systemreset.exe prepara el BCD para reiniciar en WinRE y pasar los parámetros de reconstrucción a ResetEngine.dll.',
      whatToLookFor: 'Opciones ofrecidas: "Mantener mis archivos" vs "Quitar todo", y "Descarga en la nube" vs "Reinstalación local".',
      technicalMetrics: 'Módulo central: C:\\Windows\\System32\\ResetEngine.dll.',
    },
    alertaEVO: {
      reversibilityRule: 'Irreversible una vez iniciado el reinicio en WinRE.',
      safetyWarning: 'Asegurate de que la laptop esté conectada al cargador; una interrupción en plena fase de reinicio de PBR puede dejar la máquina en bucle de booteo.',
    },
    evidenceBadge: {
      code: 'RESET_THIS_PC_05',
      label: 'PUSH-BUTTON RESET'
    }
  },
  {
    id: 'sec-13-06',
    code: '13.06',
    title: 'Keep My Files',
    subtitle: 'Preservación selectiva: cómo Windows salva %USERPROFILE% y purga el software',
    targetStage: 'PBR User Data Migration Engine',
    commandName: 'systemreset -> Keep My Files',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'En "Mantener mis archivos", Windows traslada tu carpeta C:\\Users a un espacio temporal seguro, borra íntegramente C:\\Program Files y C:\\Windows, instala un Windows nuevo y vuelve a inyectar tu perfil.',
      mythVsTruth: {
        mentira: '"Mantener mis archivos" conserva tus aplicaciones y programas instalados como Word, Chrome o Steam.',
        verdad: 'Conserva únicamente tus archivos personales (documentos, fotos, descargas, escritorio). Todas las aplicaciones de terceros se desinstalan por completo y Windows genera un archivo AppsRemoved.html en el escritorio.',
        comprobalo: 'Revisá el archivo AppsRemoved.html que se crea en el escritorio tras completar el restablecimiento.',
      },
    },
    entende: {
      queEs: 'El método de restablecimiento que preserva las cuentas de usuario locales, la configuración de red básica y el árbol de carpetas de usuario.',
      paraQueSirve: 'Recuperar un Windows dañado por controladores o software inestable sin obligar al usuario a hacer una copia de seguridad manual de gigabytes de archivos personales.',
      quePasaSiFalta: 'Si una clave de registro dentro del hive NTUSER.DAT del usuario está profundamente dañada, el perfil restaurado puede heredar fallas tras el proceso.',
    },
    interactua: {
      cliExample: 'cmd /c type C:\\Users\\Public\\Desktop\\RemovedApps.html (post-reinicio)',
      psExample: 'Get-ChildItem -Path "$env:USERPROFILE" -Force | Select Name, Mode, LastWriteTime',
      syntaxBreakdown: 'El motor PBR migra selectivamente USMT (User State Migration Tool) scripts para preservar los datos de usuario.',
      whatToLookFor: 'Preservación íntegra de Documentos, Imágenes, Descargas y Escritorio. Eliminación de claves de registro en HKLM\\Software.',
      technicalMetrics: 'Preserva: %USERPROFILE%. Purga: HKLM\\SOFTWARE, %ProgramFiles%, %ProgramFiles(x86)%.',
    },
    alertaEVO: {
      reversibilityRule: 'Las aplicaciones borradas deben reinstalarse manualmente.',
      safetyWarning: 'Los archivos que hayas guardado directamente en la raíz de C:\\ (fuera de C:\\Users) pueden perderse durante el saneamiento.',
    },
    evidenceBadge: {
      code: 'KEEP_FILES_06',
      label: 'PROFILE SURVIVAL'
    }
  },
  {
    id: 'sec-13-07',
    code: '13.07',
    title: 'Remove Everything',
    subtitle: 'Limpieza total: borrado del volumen, regeneración de hives y limpieza de unidades',
    targetStage: 'PBR Total Drive Erasure & Zeroing Option',
    commandName: 'systemreset -> Remove Everything',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: '"Quitar todo" te ofrece dos opciones críticas: "Solo quitar mis archivos" (tarda minutos) o "Limpiar completamente la unidad" (tarda horas porque escribe ceros para que nadie recupere tus datos).',
      mythVsTruth: {
        mentira: '"Quitar todo" deja el disco limpio para vender la PC sin riesgo de que recuperen mis fotos con software forense.',
        verdad: 'Si elegís la opción rápida, los datos son fácilmente recuperables con herramientas como Recuva. Solo la opción "Limpiar la unidad" ejecuta una sanitización por sobreescritura de sectores.',
        comprobalo: 'En el asistente de systemreset, hacé clic en "Cambiar configuración" y activá la opción "¿Limpiar los datos?".',
      },
    },
    entende: {
      queEs: 'El restablecimiento completo de Windows a su estado de fábrica sin retener ninguna cuenta de usuario, archivo o configuración.',
      paraQueSirve: 'Preparar una computadora para la venta, donación o reciclaje empresarial garantizando la eliminación de datos corporativos.',
      quePasaSiFalta: 'Si no se limpia la unidad al transferir un equipo usado, el nuevo propietario puede recuperar credenciales de inicio de sesión y datos confidenciales.',
    },
    interactua: {
      cliExample: 'systemreset (seleccionar Quitar todo -> Limpiar la unidad)',
      psExample: 'Get-Disk | Select Number, FriendlyName, OperationalStatus',
      syntaxBreakdown: 'La limpieza profunda escribe patrones de bits aleatorios o ceros en las áreas no asignadas del volumen.',
      whatToLookFor: 'Al finalizar, la máquina se reinicia en la pantalla de bienvenida de primera configuración (OOBE).',
      technicalMetrics: 'Sanitización de almacenamiento conforme a directrices NIST SP 800-88 Clear.',
    },
    alertaEVO: {
      reversibilityRule: 'COMPLETAMENTE IRREVERSIBLE.',
      safetyWarning: 'Asegurate de haber respaldado tus datos esenciales en la nube o disco externo antes de confirmar este modo.',
    },
    evidenceBadge: {
      code: 'REMOVE_ALL_07',
      label: 'TOTAL FACTORY WIPE'
    }
  },
  {
    id: 'sec-13-08',
    code: '13.08',
    title: 'In-place repair',
    subtitle: 'La actualización en contexto: reparación milagrosa conservando datos, apps y licencias',
    targetStage: 'Live OS Servicing via Mounted ISO',
    commandName: 'setup.exe /auto upgrade',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Es el secreto mejor guardado de los administradores de sistemas: podés reparar Windows sin perder NINGÚN programa ni archivo montando una ISO oficial desde el escritorio y ejecutando setup.exe.',
      mythVsTruth: {
        mentira: 'Para reparar archivos de Windows que DISM o SFC no pueden arreglar, la única solución es formatear y volver a instalar todos los programas.',
        verdad: 'El "In-place Upgrade" (Reparación en contexto) reemplaza todos los binarios y servicios del sistema operativo conservando el 100% de tus programas, juegos, configuraciones y archivos personales intactos.',
        comprobalo: 'Montá la ISO oficial de tu misma versión de Windows en el Explorador, ejecutá setup.exe y seleccioná "Conservar archivos personales y aplicaciones".',
      },
    },
    entende: {
      queEs: 'El proceso de instalación de actualización ejecutado directamente desde una sesión de Windows en vivo para reinstalar la capa base del sistema.',
      paraQueSirve: 'Repara corrupciones catastróficas de WinSxS, servicios de Windows Update rotos, fallas del menú Inicio y dependencias DLL sin exigir reinstalación de programas.',
      quePasaSiFalta: 'Si la ISO montada es de un idioma diferente al de la instalación actual o de una versión anterior, la opción "Conservar aplicaciones" aparecerá bloqueada en gris.',
    },
    interactua: {
      cliExample: 'setup.exe /auto upgrade /quiet /migratedrivers all',
      psExample: 'Mount-DiskImage -ImagePath "C:\\ISOs\\Win11.iso" -PassThru | Get-Volume',
      syntaxBreakdown: 'setup.exe /auto upgrade automatiza la validación de compatibilidad y migra el estado del sistema mediante la infraestructura de SetupHost.',
      whatToLookFor: 'Pantalla de confirmación con tilde en: "Conservar archivos personales y aplicaciones".',
      technicalMetrics: 'Tiempo promedio: 20 a 40 minutos dependiendo de la velocidad del SSD.',
    },
    alertaEVO: {
      reversibilityRule: 'Genera automáticamente una carpeta C:\\Windows.old que permite revertir al estado anterior durante 10 días.',
      safetyWarning: 'Asegurate de tener al menos 20 GB de espacio libre en C: antes de iniciar la reparación en contexto.',
    },
    evidenceBadge: {
      code: 'INPLACE_REPAIR_08',
      label: 'IN-PLACE REPAIR'
    }
  },
  {
    id: 'sec-13-09',
    code: '13.09',
    title: 'OOBE',
    subtitle: 'Out-Of-Box Experience: msoobe.exe, aprovisionamiento de cuentas y el bypass de red',
    targetStage: 'Post-Setup Out-Of-Box Provisioning',
    commandName: 'oobe\\bypassnro.cmd / sysprep /oobe',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La fase de bienvenida donde Windows te pide región, teclado y cuenta Microsoft es una aplicación web local ejecutada por C:\\Windows\\System32\\oobe\\msoobe.exe.',
      mythVsTruth: {
        mentira: 'Windows 11 exige obligatoriamente tener conexión a internet y crear una cuenta Microsoft para poder terminar la instalación.',
        verdad: 'Presionando Shift + F10 en la pantalla de bienvenida y escribiendo "oobe\\bypassnro", el asistente se reinicia y muestra el botón mágico "No tengo internet" para crear una cuenta local tradicional offline.',
        comprobalo: 'Inspeccioná el archivo C:\\Windows\\System32\\oobe\\BypassNRO.cmd: es un script por lotes nativo que escribe la clave de registro HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\OOBE\\BypassNRO = 1.',
      },
    },
    entende: {
      queEs: 'El asistente final de aprovisionamiento de usuario y personalización que se ejecuta antes de cargar por primera vez el escritorio de Windows.',
      paraQueSirve: 'Configura el primer usuario administrador, zona horaria, opciones de privacidad y telemetría de diagnósticos.',
      quePasaSiFalta: 'Si OOBE sufre un bucle infinito (común por fallas en drivers de red), la máquina queda atrapada en "Un momento..." sin poder ingresar al escritorio.',
    },
    interactua: {
      cliExample: 'oobe\\bypassnro',
      psExample: 'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\OOBE" -Name "BypassNRO" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'BypassNRO modifica el registro y reinicia el servicio NetworkSetupSvc para omitir el chequeo obligatorio de conectividad WAN.',
      whatToLookFor: 'Aparición de la opción "Continuar con la configuración limitada" para crear cuenta de usuario local.',
      technicalMetrics: 'Ruta del ejecutable: C:\\Windows\\System32\\oobe\\msoobe.exe.',
    },
    alertaEVO: {
      reversibilityRule: 'Totalmente seguro y documentado.',
      safetyWarning: 'En equipos corporativos unidos a Azure AD / Entra ID, omitir OOBE puede impedir la recepción de políticas Intune de la empresa.',
    },
    evidenceBadge: {
      code: 'OOBE_PROVISION_09',
      label: 'OOBE ENGINE'
    }
  },
  {
    id: 'sec-13-10',
    code: '13.10',
    title: 'Drivers post-instalación',
    subtitle: 'Orden crítico de despliegue: Chipset, GPU, Audio/Red y prevención de conflictos DCH',
    targetStage: 'Post-Install Hardware Driver Ingestion',
    commandName: 'pnputil /enum-drivers / dism /online /get-drivers',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Instalar los drivers en desorden provoca micro-tirones y fallas de gestión de energía: el driver del Chipset debe instalarse SIEMPRE primero antes que la placa de video.',
      mythVsTruth: {
        mentira: 'Windows Update instala los mejores drivers posibles y no hace falta descargar nada de los fabricantes.',
        verdad: 'Windows Update suele instalar drivers genéricos antiguos con paneles de control DCH recortados. Para placas madre modernas y GPUs dedicadas (NVIDIA/AMD), los paquetes oficiales del fabricante son indispensables.',
        comprobalo: 'Ejecutá "pnputil /enum-drivers" para ver la lista completa de paquetes .inf de terceros instalados en el Driver Store de Windows.',
      },
    },
    entende: {
      queEs: 'El proceso de inyección e instalación de paquetes de controladores (INF, SYS, CAT) que enseñan al kernel a comunicarse con los buses y componentes del silicio.',
      paraQueSirve: 'Garantiza el correcto escalamiento de voltaje, soporte de estados de suspensión C-States, aceleración de video por hardware y latencias de audio DPC mínimas.',
      quePasaSiFalta: 'Sin el driver de Chipset adecuado, el Administrador de Dispositivos mostrará dispositivos desconocidos "PCI Device" y la gestión térmica del CPU funcionará de manera ineficiente.',
    },
    interactua: {
      cliExample: 'pnputil /enum-drivers',
      psExample: 'Get-CimInstance Win32_PnPSignedDriver | Where-Object DeviceName -match "NVIDIA|AMD|Intel" | Select DeviceName, DriverVersion',
      syntaxBreakdown: 'pnputil es la herramienta oficial de la línea de comandos de Windows para administrar el Driver Store (C:\\Windows\\System32\\DriverStore).',
      whatToLookFor: 'Comprobar que no existan signos de exclamación amarillos en el Administrador de Dispositivos (devmgmt.msc).',
      technicalMetrics: 'Ubicación física: C:\\Windows\\System32\\DriverStore\\FileRepository.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no invasiva.',
      safetyWarning: 'Evitá programas automáticos "Driver Boosters" de terceros: suelen inyectar drivers modificados que causan pantallas azules de IRQL_NOT_LESS_OR_EQUAL.',
    },
    evidenceBadge: {
      code: 'DRIVER_TOPOLOGY_10',
      label: 'DRIVER STORE STACK'
    }
  },
  {
    id: 'sec-13-11',
    code: '13.11',
    title: 'Windows Update post-instalación',
    subtitle: 'Cadencia de parches: LCUs, Servicing Stack Updates (SSU) y calibración de reinicios',
    targetStage: 'Post-Install Cumulative Servicing',
    commandName: 'wmic qfe list / Get-HotFix',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows Update no instala los parches de a uno como antes: instala un paquete consolidado mensual llamado LCU (Latest Cumulative Update) combinado con el SSU (Servicing Stack Update).',
      mythVsTruth: {
        mentira: 'Desactivar Windows Update para siempre hace que la PC sea más rápida.',
        verdad: 'Dejar el sistema desactualizado lo vuelve vulnerable a exploits remotos de día cero conocidos y rompe la compatibilidad con frameworks modernos de .NET y librerías DirectX.',
        comprobalo: 'Ejecutá "Get-HotFix" en PowerShell para listar todos los parches de seguridad KB instalados en tu equipo con su fecha exacta.',
      },
    },
    entende: {
      queEs: 'El subsistema de servicio y actualización del kernel (TrustedInstaller / WUA) responsable de mantener los binarios del sistema sincronizados con los parches de seguridad de Microsoft.',
      paraQueSirve: 'Mitigar vulnerabilidades críticas de ejecución remota de código y parchar bugs de rendimiento reportados por la telemetría global.',
      quePasaSiFalta: 'Si el Servicing Stack Update (SSU) está corrupto, cualquier intento de actualizar Windows fallará en bucle con errores como 0x800f0922.',
    },
    interactua: {
      cliExample: 'wmic qfe get HotFixID,Description,InstalledOn',
      psExample: 'Get-HotFix | Sort-Object InstalledOn -Descending | Select -First 10 HotFixID, Description, InstalledOn',
      syntaxBreakdown: 'Get-HotFix consulta la clase WMI Win32_QuickFixEngineering para obtener el historial verificado de parches KB.',
      whatToLookFor: 'Presencia del último paquete acumulativo mensual con estado instalado.',
      technicalMetrics: 'Servicio de fondo: wuauserv (Windows Update Service).',
    },
    alertaEVO: {
      reversibilityRule: 'Inspección de parches no destructiva.',
      safetyWarning: 'Nunca apagues la computadora de forma forzada cuando la pantalla muestre "Trabajando en las actualizaciones... No apagues el equipo".',
    },
    evidenceBadge: {
      code: 'WINDOWS_UPDATE_11',
      label: 'SERVICING STACK'
    }
  },
  {
    id: 'sec-13-12',
    code: '13.12',
    title: 'Backup antes de reinstalar',
    subtitle: 'Estrategia 3-2-1: extracción de AppData sensible, licencias, certificados y drivers exportados',
    targetStage: 'Pre-Installation Data Extraction',
    commandName: 'dism /online /export-driver /destination:D:\\DriversBackup',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Hacer backup no es solo copiar la carpeta "Descargas": si no exportás tus drivers de red con DISM antes de formatear, podrías quedarte sin internet al terminar la instalación.',
      mythVsTruth: {
        mentira: 'Con copiar Documentos y Fotos ya tenés todo respaldado.',
        verdad: 'Marcadores de navegadores, claves SSH, configuraciones de programas, certificados personales de AFIP/Hacienda y claves de juegos están ocultos dentro de %APPDATA% y %LOCALAPPDATA%.',
        comprobalo: 'Ejecutá dism /online /export-driver para guardar todos los drivers instalados en tu PC en una carpeta externa antes de tocar el disco.',
      },
    },
    entende: {
      queEs: 'El protocolo sistemático de aseguramiento de datos personales, configuraciones de usuario y componentes de hardware antes de una operación de reinstalación.',
      paraQueSirve: 'Garantizar que ningún dato crítico sea destruido y permitir una restauración fluida de los entornos de trabajo habituales.',
      quePasaSiFalta: 'Si reinstalás sin respaldar certificados de usuario o claves criptográficas, los archivos cifrados con EFS (Encrypting File System) serán irrecuperables para siempre.',
    },
    interactua: {
      cliExample: 'dism /online /export-driver /destination:D:\\DriversBackup',
      psExample: 'Export-WindowsDriver -Online -Destination "D:\\DriversBackup"',
      syntaxBreakdown: 'dism /export-driver extrae exclusivamente los drivers de terceros del Driver Store con sus archivos .inf, .cat y .sys originales listos para reinyectar.',
      whatToLookFor: 'Comprobar que los drivers de Wi-Fi y Ethernet se encuentren exportados en la carpeta de destino.',
      technicalMetrics: 'Carpetas críticas: %APPDATA%, %LOCALAPPDATA%, %USERPROFILE%\\.ssh, %USERPROFILE%\\.aws.',
    },
    alertaEVO: {
      reversibilityRule: 'Operación puramente de copia y exportación.',
      safetyWarning: 'Verificá que el disco externo de respaldo contenga físicamente los archivos antes de reiniciar para instalar Windows.',
    },
    evidenceBadge: {
      code: 'BACKUP_PROTOCOL_12',
      label: 'BACKUP STRATEGY'
    }
  },
  {
    id: 'sec-13-13',
    code: '13.13',
    title: 'Qué conserva cada método',
    subtitle: 'La matriz comparativa definitiva: In-place Upgrade vs Keep My Files vs Reset All vs Clean',
    targetStage: 'Reinstallation Architecture Decision Matrix',
    commandName: 'dism /Get-SysPrepInfo / systemreset',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La diferencia entre perder una semana reinstalando programas o solucionar el problema en 30 minutos depende de elegir el método exacto en la matriz de reinstalación.',
      mythVsTruth: {
        mentira: 'Todos los métodos de reinstalación de Windows borran tus programas.',
        verdad: 'El In-place Upgrade conserva el 100% de los programas y configuraciones. Keep My Files conserva tus archivos pero borra programas. Reset All y Clean Install borran absolutamente todo.',
        comprobalo: 'Revisá la tabla comparativa oficial de Microsoft SetupHost sobre los niveles de migración de estado.',
      },
    },
    entende: {
      queEs: 'El modelo taxonómico de los cuatro niveles de reconfiguración del sistema operativo disponibles en la plataforma Windows.',
      paraQueSirve: 'Permite al técnico e ingeniero seleccionar la herramienta menos invasiva necesaria para resolver el problema específico del cliente.',
      quePasaSiFalta: 'Elegir un método erróneo (como Clean Install ante un simple error de DLLs) provoca pérdidas de tiempo masivas e innecesarias para el usuario.',
    },
    interactua: {
      cliExample: 'powershell "Get-ChildItem Env: | Select Name, Value"',
      psExample: '[PSCustomObject]@{Metodo="In-Place";Archivos="Si";Apps="Si";Registro="Limpio/Reparado"}, [PSCustomObject]@{Metodo="Keep Files";Archivos="Si";Apps="No";Registro="Nuevo"} | Format-Table',
      syntaxBreakdown: 'La matriz diferencia: 1) Archivos personales en C:\\Users, 2) Programas instalados en Program Files, 3) Registro HKLM/HKCU, 4) Drivers.',
      whatToLookFor: 'Evaluar el objetivo: ¿Preservar tiempo de configuración de aplicaciones (In-Place) o erradicar virus profundo (Clean Install)?',
      technicalMetrics: 'Nivel 1: In-Place. Nivel 2: Keep My Files. Nivel 3: Reset All. Nivel 4: Clean Install (USB).',
    },
    alertaEVO: {
      reversibilityRule: 'Diagnóstico y planificación pasiva.',
      safetyWarning: 'Nunca elijas "Quitar todo" asumiendo que tus archivos se mantendrán.',
    },
    evidenceBadge: {
      code: 'REINSTALL_MATRIX_13',
      label: 'DECISION MATRIX'
    }
  },
  {
    id: 'sec-13-14',
    code: '13.14',
    title: 'Qué significa realmente “formatear sin perder datos”',
    subtitle: 'Mito vs realidad técnica: partición secundaria D:, carpetas Windows.old y aislamiento',
    targetStage: 'Storage Layout Design for Disaster Recovery',
    commandName: 'dir C:\\Windows.old / Get-Volume',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Los profesionales no "formatean sin perder datos": diseñan la arquitectura del disco con C: exclusivamente para el sistema operativo y D: para todos los datos y descargas.',
      mythVsTruth: {
        mentira: 'Se puede formatear la partición C: con format C: /Q y conservar los archivos personales que estaban dentro de ella.',
        verdad: 'Formatear una partición borra irremediablemente sus descriptores lógicos. Lo que hace la gente es instalar encima sin formatear (creando Windows.old) o tener sus archivos en otra partición D:.',
        comprobalo: 'Si reinstalás Windows sin formatear la partición existente en el instalador, revisá la raíz de C: para ver la carpeta C:\\Windows.old con todos tus archivos antiguos.',
      },
    },
    entende: {
      queEs: 'La estrategia de diseño de almacenamiento y el comportamiento de preservación en carpetas de archivo histórico de Windows Setup.',
      paraQueSirve: 'Evitar el colapso operativo del usuario ante desastres catastróficos aislando el ciclo de vida del OS del ciclo de vida de los datos.',
      quePasaSiFalta: 'Si todo se guarda en C: sin partición separada ni copias de seguridad, cualquier formateo destruye de inmediato la vida digital del usuario.',
    },
    interactua: {
      cliExample: 'dir /a C:\\Windows.old',
      psExample: 'Test-Path "C:\\Windows.old"',
      syntaxBreakdown: 'Windows.old es un contenedor generado automáticamente por SetupHost donde se reubican las carpetas C:\\Windows, C:\\Program Files y C:\\Users anteriores.',
      whatToLookFor: 'C:\\Windows.old\\Users\\TuUsuario para rescatar documentos que no se habían respaldado.',
      technicalMetrics: 'Período de retención por defecto: 10 días antes de purga automática por Storage Sense.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura.',
      safetyWarning: 'No uses "Liberador de espacio en disco" para eliminar "Instalaciones anteriores de Windows" hasta haber verificado que rescataste todo de Windows.old.',
    },
    evidenceBadge: {
      code: 'WINDOWS_OLD_ISOLATION_14',
      label: 'DATA ISOLATION'
    }
  },
  {
    id: 'sec-13-15',
    code: '13.15',
    title: 'Recovery partition',
    subtitle: 'Ubicación física y atributos: GUID de tipo de partición y comando reagentc',
    targetStage: 'Recovery Partition Architecture (reagentc)',
    targetComponent: 'GPT Partition Type GUID de94bba4-06d1-4d40-a16a-bfd50179d6ac',
    commandName: 'reagentc /info / reagentc /enable',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La partición de recuperación tiene atributos binarios que le dicen a Windows: "ocultame, no me asignes letra y prohibí que cualquier usuario normal me modifique".',
      mythVsTruth: {
        mentira: 'La partición de recuperación solo sirve para restaurar la PC con las aplicaciones basura que traía de fábrica cuando la compraste.',
        verdad: 'Aloja el entorno WinRE oficial de Microsoft con herramientas de diagnóstico del kernel, reparación de BCD y restauración de puntos del sistema.',
        comprobalo: 'Ejecutá "reagentc /info" en CMD administrador para ver la ruta exacta del archivo winre.wim y el estado activo del entorno.',
      },
    },
    entende: {
      queEs: 'Una partición técnica dedicada protegida por el flag GPT 0x8000000000000001 (GPT_BASIC_DATA_ATTRIBUTE_NO_DRIVE_LETTER | GPT_ATTRIBUTE_PLATFORM_REQUIRED).',
      paraQueSirve: 'Alojar la imagen WIM de recuperación para que el sistema pueda arrancar en un entorno auxiliar ante fallas críticas de inicio.',
      quePasaSiFalta: 'Si la partición de recuperación no tiene suficiente espacio libre (menos de 250 MB libres), las actualizaciones acumulativas de seguridad (como KB5034441) fallarán con el código 0x80070643.',
    },
    interactua: {
      cliExample: 'reagentc /info',
      psExample: 'Get-Partition | Where-Object Type -eq "Recovery" | Select DiskNumber, PartitionNumber, Size, Offset',
      syntaxBreakdown: 'reagentc /enable registra la ubicación del WIM en el almacén BCD y activa el gancho de booteo de recuperación.',
      whatToLookFor: 'Windows RE status: Enabled. BCD ID con identificador GUID válido.',
      technicalMetrics: 'GUID de partición de recuperación GPT: de94bba4-06d1-4d40-a16a-bfd50179d6ac.',
    },
    alertaEVO: {
      reversibilityRule: 'reagentc /info es completamente seguro.',
      safetyWarning: 'Si necesitás ampliar la partición de recuperación, deshabilitá primero WinRE con reagentc /disable para que el WIM se mueva temporalmente a C:.',
    },
    evidenceBadge: {
      code: 'RECOVERY_PART_15',
      label: 'RECOVERY ATTRIBUTES'
    }
  },
  {
    id: 'sec-13-16',
    code: '13.16',
    title: 'WinRE',
    subtitle: 'Windows Recovery Environment: arquitectura WinPE, boot.sdi y consola de rescate',
    targetStage: 'WinRE Recovery Environment (winre.wim)',
    targetComponent: '\\Recovery\\WindowsRE\\winre.wim & boot.sdi',
    commandName: 'reagentc /boottore / shutdown /r /o /f /t 0',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'WinRE es un Windows independiente en miniatura: cuando tu PC falla dos veces seguidas al arrancar, el BCD conmuta automáticamente a WinRE para intentar revivir el sistema.',
      mythVsTruth: {
        mentira: 'La pantalla azul con opciones avanzadas de Windows funciona dentro de tu Windows normal.',
        verdad: 'WinRE arranca un disco RAM virtual en memoria a partir de boot.sdi y winre.wim. La unidad C: de tu disco suele verse como D: o E: porque WinRE asigna letras independientes.',
        comprobalo: 'Ejecutá "reagentc /boottore" y reiniciá: el sistema cargará directamente el entorno WinRE en el próximo inicio.',
      },
    },
    entende: {
      queEs: 'Un entorno de recuperación basado en Windows Preinstallation Environment (Windows PE) con controladores y utilidades de diagnóstico avanzadas.',
      paraQueSirve: 'Proveer acceso al Símbolo del Sistema de emergencia, Reparación de Inicio, Restauración del Sistema y opciones de desinstalación de actualizaciones.',
      quePasaSiFalta: 'Si el sistema operativo sufre una pantalla azul de arranque y WinRE está dañado o deshabilitado, la máquina quedará en bucle infinito de reinicios sin diagnóstico.',
    },
    interactua: {
      cliExample: 'shutdown /r /o /f /t 0',
      psExample: 'Get-Item "C:\\Recovery\\WindowsRE\\winre.wim" -Force -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'shutdown /r /o reinicia la computadora abriendo el menú de opciones de arranque avanzadas de WinRE.',
      whatToLookFor: 'Acceso a "Solucionar problemas" -> "Opciones avanzadas".',
      technicalMetrics: 'Contenedor: winre.wim (típicamente entre 400 MB y 700 MB).',
    },
    alertaEVO: {
      reversibilityRule: 'Reinicio controlado hacia la consola de recuperación.',
      safetyWarning: 'En la consola de WinRE, las letras de unidad cambian: ejecutá siempre "bcdedit" o "dir" para ubicar cuál letra corresponde a tu Windows real.',
    },
    evidenceBadge: {
      code: 'WINRE_ARCHITECTURE_16',
      label: 'WINRE RAMDISK'
    }
  },
  {
    id: 'sec-13-17',
    code: '13.17',
    title: 'Startup Repair',
    subtitle: 'StartRep.exe: diagnóstico automático de BCD corrupto, sectores y drivers dañados',
    targetStage: 'Startup Repair Diagnosis (StartRep.exe)',
    targetComponent: 'X:\\Windows\\System32\\StartRep.exe & SrtTrail.txt',
    commandName: 'type X:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Cuando la "Reparación de inicio" dice que no pudo reparar el equipo, el motivo exacto de la falla quedó escrito en un archivo de texto llamado SrtTrail.txt.',
      mythVsTruth: {
        mentira: 'La Reparación de inicio nunca sirve para nada y solo hace perder tiempo.',
        verdad: 'StartRep.exe resuelve de forma automática el 90% de problemas comunes de punteros de BCD corruptos, claves de registro de arranque dañadas y firmas de drivers desincronizadas.',
        comprobalo: 'Si una PC no inicia, abrí la consola en WinRE y leé el archivo C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt para ver el driver o sector que causó el fallo.',
      },
    },
    entende: {
      queEs: 'El motor automatizado de diagnóstico y auto-reparación de la secuencia de booteo de Windows.',
      paraQueSirve: 'Inspecciona automáticamente la partición de sistema, integridad del BCD, sectores de metadatos, archivos del kernel (ntoskrnl.exe) y controladores Boot-Start.',
      quePasaSiFalta: 'Sin este componente, cualquier inconsistencia menor en el archivo de datos de configuración de arranque requeriría comandos manuales complejos de bcdedit y bcdboot.',
    },
    interactua: {
      cliExample: 'type C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt',
      psExample: 'Get-Content "C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'SrtTrail.txt contiene el registro secuencial de cada test ejecutado por StartRep.exe (Test de integridad de archivos del SO, prueba de BCD, test de disco).',
      whatToLookFor: 'Buscar líneas con "Causa principal encontrada:" y códigos de error (ej: 0x0, 0x490, driver no firmado).',
      technicalMetrics: 'Log canónico: Srt\\SrtTrail.txt en el directorio de logs del sistema.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no invasiva de bitácora.',
      safetyWarning: 'Si SrtTrail indica un archivo de sistema corrupto, podés restaurarlo con DISM /Image:C:\\ /Cleanup-Image /RestoreHealth /Source:D:\\sources\\install.wim.',
    },
    evidenceBadge: {
      code: 'STARTUP_REPAIR_17',
      label: 'SRTTRAIL DIAG'
    }
  },
  {
    id: 'sec-13-18',
    code: '13.18',
    title: 'Restore Point',
    subtitle: 'Puntos de restauración del sistema: snapshots del registro y ejecutables protegidos',
    targetStage: 'System Restore Snapshots (rstrui.exe)',
    targetComponent: 'System Volume Information\\{GUID} & rstrui.exe',
    commandName: 'rstrui.exe / Get-ComputerRestorePoint',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Un Punto de Restauración no guarda una copia completa de tus gigabytes de archivos: solo congela los hives del Registro, controladores y ejecutables del sistema mediante copias en la sombra de VSS.',
      mythVsTruth: {
        mentira: 'Restaurar el sistema a un punto de hace 3 días borra los documentos de Word y fotos que guardaste ayer.',
        verdad: 'La Restauración del Sistema ignora por completo tus documentos, fotos, correos y descargas. Solo revierte programas instalados recientemente, controladores y claves de registro del sistema.',
        comprobalo: 'Ejecutá "rstrui.exe" para abrir el asistente visual o consultá Get-ComputerRestorePoint en PowerShell.',
      },
    },
    entende: {
      queEs: 'Una instantánea diferencial del estado de los archivos y la configuración del sistema operativo guardada en System Volume Information.',
      paraQueSirve: 'Permite volver en el tiempo tras instalar un driver conflictivo, una actualización con bugs o un software que desestabilizó Windows.',
      quePasaSiFalta: 'En Windows 10 y 11, la Protección del Sistema suele venir DESACTIVADA por defecto para ahorrar espacio en SSDs pequeños: si no la activás, no tendrás red de contención.',
    },
    interactua: {
      cliExample: 'powershell "Get-ComputerRestorePoint | Format-Table SequenceNumber, Description, CreationTime"',
      psExample: 'Checkpoint-Computer -Description "Punto_Previo_EVO" -RestorePointType "MODIFY_SETTINGS"',
      syntaxBreakdown: 'Checkpoint-Computer invoca al servicio VSS para congelar el volumen y capturar los deltas del Registro.',
      whatToLookFor: 'Lista de puntos con fecha, hora y tipo (APPLICATION_INSTALL, SYSTEM_CHANGE).',
      technicalMetrics: 'Almacén físico: System Volume Information (restringido para SYSTEM).',
    },
    alertaEVO: {
      reversibilityRule: 'La aplicación de un punto puede revertirse si no resuelve el problema.',
      safetyWarning: 'Verificá con frecuencia que "Protección del sistema" esté en "Activada" en Propiedades del Sistema -> pestaña Protección del sistema.',
    },
    evidenceBadge: {
      code: 'RESTORE_POINT_18',
      label: 'SYSTEM RESTORE'
    }
  },
  {
    id: 'sec-13-19',
    code: '13.19',
    title: 'VSS',
    subtitle: 'Volume Shadow Copy Service: arquitectura de snapshots, writers y vssadmin',
    targetStage: 'Volume Shadow Copy Engine (VSS / volsnap.sys)',
    targetComponent: 'volsnap.sys & Volume Shadow Copy Service (VSS)',
    commandName: 'vssadmin list shadows / vssadmin list writers',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '¿Cómo puede Windows hacer una copia de seguridad de un archivo que está abierto y escribiéndose en este milisegundo? Gracias al subsistema VSS y su driver volsnap.sys.',
      mythVsTruth: {
        mentira: 'No se puede copiar un archivo bloqueado en uso por Windows o una base de datos SQL activa.',
        verdad: 'VSS congela las escrituras durante milisegundos (Quiescence), crea un snapshot de solo lectura a nivel de bloques de disco y permite leer los datos congelados mientras la base de datos sigue operando.',
        comprobalo: 'Ejecutá "vssadmin list shadows" en CMD administrador para ver todas las instantáneas de volumen activas en tu sistema.',
      },
    },
    entende: {
      queEs: 'Un marco de trabajo integral del subsistema de almacenamiento de Windows para la creación de copias de seguridad consistentes en el tiempo.',
      paraQueSirve: 'Es el motor fundamental sobre el que funcionan los Puntos de Restauración, el Historial de Archivos, Versiones Anteriores y el software de backup corporativo (Veeam, Acronis).',
      quePasaSiFalta: 'Si un VSS Writer falla (vssadmin list writers muestra "State: Failed"), cualquier software de copia de seguridad arrojará error y abortará la copia.',
    },
    interactua: {
      cliExample: 'vssadmin list shadows',
      psExample: 'Get-CimInstance Win32_ShadowCopy | Select ID, DeviceObject, InstallDate, VolumeName',
      syntaxBreakdown: 'vssadmin list writers verifica la salud de los coordinadores (Registry Writer, System Writer, COM+ Writer).',
      whatToLookFor: 'State: [1] Stable y Last error: No error en todos los escritores.',
      technicalMetrics: 'Driver de kernel: volsnap.sys (Volume Snapshot driver).',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura inofensiva.',
      safetyWarning: 'vssadmin delete shadows /all borra instantáneamente todos los puntos de restauración y copias de versiones anteriores del disco.',
    },
    evidenceBadge: {
      code: 'VSS_ENGINE_19',
      label: 'VSS SHADOW ENGINE'
    }
  },
  {
    id: 'sec-13-20',
    code: '13.20',
    title: 'Previous Versions',
    subtitle: 'Versiones Anteriores: recuperación granular de archivos modificados mediante Shadow Copies',
    targetStage: 'Previous Versions Namespace (Shadow Copies)',
    targetComponent: 'Shadow Copy Namespace Mount Points',
    commandName: 'vssadmin list shadows / Shadow Copy Explorer',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Si borraste o sobrescribiste por error un documento de Excel hace una hora, podés hacer clic derecho en su carpeta -> Propiedades -> "Versiones anteriores" y recuperarlo al instante.',
      mythVsTruth: {
        mentira: 'Una vez que sobrescribís y guardás un archivo en Windows, el contenido previo desaparece para siempre si no tenías un backup manual en un pendrive.',
        verdad: 'Si VSS o el Historial de Archivos están activos, Windows mantiene instantáneas históricas de versiones de los archivos que podés restaurar con un solo clic.',
        comprobalo: 'Hacé clic derecho en cualquier carpeta personal -> Propiedades -> pestaña "Versiones anteriores".',
      },
    },
    entende: {
      queEs: 'La interfaz gráfica expuesta en el shell de Windows para navegar e interactuar con los árboles de directorios capturados en las instantáneas de volumen (Shadow Copies).',
      paraQueSirve: 'Permite a los usuarios rescatar versiones previas de archivos corruptos o sobrescritos sin tener que restaurar todo el sistema operativo.',
      quePasaSiFalta: 'Si no hay copias de instantánea creadas ni espacio asignado para VSS, la pestaña "Versiones anteriores" indicará "No hay versiones anteriores disponibles".',
    },
    interactua: {
      cliExample: 'vssadmin list shadowstorage',
      psExample: 'Get-CimInstance Win32_ShadowStorage | Select AllocatedSpace, MaxSpace, UsedSpace',
      syntaxBreakdown: 'vssadmin list shadowstorage muestra el porcentaje máximo de disco reservado para almacenar instantáneas históricas de archivos.',
      whatToLookFor: 'UsedSpace menor que MaxSpace y presencia de instantáneas recientes.',
      technicalMetrics: 'Ruta de acceso UNC a snapshot: \\\\localhost\\C$\\@GMT-YYYY.MM.DD-HH.MM.SS.',
    },
    alertaEVO: {
      reversibilityRule: 'Solo lectura e inspección de deltas.',
      safetyWarning: 'Al restaurar una versión anterior, elegí "Restaurar en..." para guardarla en una carpeta distinta y evitar sobrescribir el archivo actual.',
    },
    evidenceBadge: {
      code: 'PREVIOUS_VERSIONS_20',
      label: 'GRANULAR SHADOWS'
    }
  }
];

export const SECTOR_13_MINICASES: Sector13MiniCase[] = [
  {
    id: 'case-13-01',
    code: 'CASE-13.01',
    title: 'La reinstalación que no resolvió el pantallazo azul',
    scenario: 'Un usuario experimentaba pantallas azules frecuentes de corrupción de memoria y archivos del sistema. Usó la opción "Restablecer este equipo" (Reset This PC) con descarga local. A las 2 horas de terminar, los mismos errores BSOD volvieron a ocurrir.',
    userStatement: '"Restablecer este equipo no sirve para nada o mi SSD está físicamente destruido."',
    initialMistake: 'Asumir que un Reset local descarga archivos limpios cuando en realidad usó la tienda de componentes WinSxS local que ya estaba corrupta.',
    diagnosticQuestion: '¿Por qué falló el restablecimiento local y qué método garantiza binarios nuevos?',
    options: [
      {
        id: 'opt-a',
        text: 'Porque el Reset local reconstruye Windows utilizando los archivos ya presentes en la partición local dañada; una instalación limpia desde un USB oficial o Reset con Descarga en la Nube descarga binarios verificados.',
        isCorrect: true,
        explanation: 'Exacto. Si el origen local está viciado, PBR local hereda la corrupción. Una instalación limpia con USB booteable oficial o Cloud Download garantiza que los archivos provienen directamente de los servidores de Microsoft.'
      },
      {
        id: 'opt-b',
        text: 'Porque no desfragmentó el SSD antes de restablecer.',
        isCorrect: false,
        explanation: 'Falso. La desfragmentación no repara archivos corruptos y daña los SSDs.'
      },
      {
        id: 'opt-c',
        text: 'Porque Windows no permite restablecer más de una vez por año.',
        isCorrect: false,
        explanation: 'Incierto y absurdo.'
      }
    ],
    technicalVerdict: 'Herencia de corrupción por origen local de PBR. La solución es una instalación limpia desde USB oficial o restablecimiento con descarga en la nube.',
    lessonLearned: 'Cuando el almacén de componentes del sistema está comprometido, solo un medio externo o Cloud Download garantiza integridad absoluta.'
  },
  {
    id: 'case-13-02',
    code: 'CASE-13.02',
    title: 'El error 0x80070643 al actualizar la partición de recuperación',
    scenario: 'Windows Update intenta instalar repetidamente un parche de seguridad de WinRE (como KB5034441) y falla en bucle con el error 0x80070643 (ERROR_INSTALL_FAILURE).',
    userStatement: '"Windows Update se rompió por completo y tengo que formatear toda la máquina."',
    initialMistake: 'Reinstalar Windows cuando el problema es simplemente que la partición Recovery carece de espacio libre para alojar el nuevo winre.wim actualizado.',
    diagnosticQuestion: '¿Cuál es la causa técnica real del error y cómo se resuelve profesionalmente?',
    options: [
      {
        id: 'opt-a',
        text: 'La partición Recovery (de ~500 MB) se quedó sin espacio libre suficiente para que el instalador de parches expanda y guarde el nuevo winre.wim; se soluciona reduciendo C: en 250 MB y ampliando la partición de recuperación.',
        isCorrect: true,
        explanation: 'Correcto. La actualización reemplaza winre.wim por una versión protegida contra la vulnerabilidad BitLocker bypass (CVE-2024-20666), requiriendo al menos 250 MB libres en la partición Recovery.'
      },
      {
        id: 'opt-b',
        text: 'El procesador no soporta instrucciones AVX2.',
        isCorrect: false,
        explanation: 'Falso.'
      },
      {
        id: 'opt-c',
        text: 'El usuario tiene desactivado el Wi-Fi.',
        isCorrect: false,
        explanation: 'No tiene relación con el error de almacenamiento.'
      }
    ],
    technicalVerdict: 'Espacio insuficiente en la partición de recuperación para la actualización de WinRE.',
    lessonLearned: 'reagentc /disable, redimensionar partición a 750 MB - 1 GB y reagentc /enable resuelve permanentemente el error.'
  },
  {
    id: 'case-13-03',
    code: 'CASE-13.03',
    title: 'La ISO de Windows 11 sin conexión a internet en OOBE',
    scenario: 'Un técnico armó una PC gamer nueva sin tarjeta Wi-Fi y la conectó a un cable de red que aún no tiene servicio. Durante la instalación de Windows 11, la pantalla de configuración inicial (OOBE) queda bloqueada en "Vamos a conectarte a una red" sin dar opción a saltar este paso.',
    userStatement: '"No se puede instalar Windows sin internet obligatorio, tengo que llevar la PC a otro lugar."',
    initialMistake: 'Creer que no hay salida cuando Windows posee un mecanismo de bypass oficial incorporado.',
    diagnosticQuestion: '¿Cuál es el comando exacto para omitir este requisito y crear un usuario local?',
    options: [
      {
        id: 'opt-a',
        text: 'Presionar Shift + F10 en la pantalla de bienvenida y ejecutar "oobe\\bypassnro" para reiniciar el instalador con la opción de cuenta offline activada.',
        isCorrect: true,
        explanation: 'Exacto. Shift + F10 abre CMD en modo SYSTEM y oobe\\bypassnro escribe la directiva de Registro para permitir la instalación offline.'
      },
      {
        id: 'opt-b',
        text: 'Apagar la máquina con el botón de encendido 5 veces seguidas.',
        isCorrect: false,
        explanation: 'Falso, eso fuerza el diagnóstico de recuperación pero no omite OOBE.'
      },
      {
        id: 'opt-c',
        text: 'Formatear la BIOS con un pendrive.',
        isCorrect: false,
        explanation: 'Peligroso e incorrecto.'
      }
    ],
    technicalVerdict: 'Activación del script nativo de Microsoft oobe\\bypassnro para desvincular el requisito de red.',
    lessonLearned: 'Shift + F10 y oobe\\bypassnro permite configurar cuentas locales sin conexión a internet en cualquier momento.'
  }
];

export const SECTOR_13_TEST_BANK: Sector13TestQuestion[] = [
  {
    id: 't13-q01',
    questionNumber: 1,
    category: 'MEDIOS_Y_DESPLIEGUE',
    question: '¿Qué archivo dentro de la carpeta /sources/ de una ISO de Windows contiene la imagen maestra completa del sistema operativo que se aplicará en el disco de destino?',
    options: [
      { id: 'a', text: 'install.wim (o install.esd en medios comprimidos).' },
      { id: 'b', text: 'boot.wim.' },
      { id: 'c', text: 'setup.exe.' },
      { id: 'd', text: 'autorun.inf.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'install.wim almacena las imágenes del sistema operativo final deseadas (Home, Pro, etc.), mientras boot.wim aloja exclusivamente el entorno de preinstalación WinPE que ejecuta el asistente de Setup.',
    relatedInvestigationCode: '13.01'
  },
  {
    id: 't13-q02',
    questionNumber: 2,
    category: 'METODOS_REINSTALACION',
    question: '¿Qué método de reinstalación permite reparar fallas críticas de archivos de Windows y de la tienda WinSxS conservando el 100% de las aplicaciones instaladas y archivos de usuario?',
    options: [
      { id: 'a', text: 'In-place repair (Actualización en contexto ejecutando setup.exe desde una ISO oficial montada en el escritorio).' },
      { id: 'b', text: 'Restablecer este equipo con "Quitar todo".' },
      { id: 'c', text: 'Clean Install borrando particiones en el booteo.' },
      { id: 'd', text: 'Formateo rápido desde diskpart.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'El In-place Upgrade reinstala los binarios y subsistemas del OS sobre sí mismo respetando la capa de software de terceros y los perfiles de usuario, reparando la tienda de componentes sin exigir reinstalar aplicaciones.',
    relatedInvestigationCode: '13.08'
  },
  {
    id: 't13-q03',
    questionNumber: 3,
    category: 'POST_INSTALACION_Y_DRIVERS',
    question: '¿Cuál es el comando DISM nativo para exportar todos los controladores de terceros instalados en una PC a una carpeta antes de formatear?',
    options: [
      { id: 'a', text: 'dism /online /export-driver /destination:<Ruta>' },
      { id: 'b', text: 'dism /cleanup-image /checkhealth' },
      { id: 'c', text: 'pnputil /delete-driver' },
      { id: 'd', text: 'driverquery /export' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'dism /online /export-driver extrae de manera limpia todos los paquetes de controladores no predeterminados de Windows del Driver Store con sus archivos INF y firmas CAT correspondientes.',
    relatedInvestigationCode: '13.12'
  },
  {
    id: 't13-q04',
    questionNumber: 4,
    category: 'WINRE_VSS_RECUPERACION',
    question: '¿Dónde se encuentra registrado el log detallado de diagnósticos y fallos cuando la Reparación de Inicio (StartRep.exe) indica que no pudo reparar el equipo?',
    options: [
      { id: 'a', text: 'C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt' },
      { id: 'b', text: 'C:\\Windows\\WindowsUpdate.log' },
      { id: 'c', text: 'C:\\boot.ini' },
      { id: 'd', text: 'C:\\Temp\\error.txt' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'SrtTrail.txt es el registro canónico escrito por el motor de Startup Repair que detalla cada prueba de arranque realizada y la causa principal encontrada del fallo.',
    relatedInvestigationCode: '13.17'
  },
  {
    id: 't13-q05',
    questionNumber: 5,
    category: 'WINRE_VSS_RECUPERACION',
    question: '¿Qué componente técnico utiliza Windows para permitir la lectura y copia de seguridad de archivos que se encuentran actualmente abiertos y bloqueados por procesos en ejecución?',
    options: [
      { id: 'a', text: 'Volume Shadow Copy Service (VSS) y el driver de instantáneas volsnap.sys.' },
      { id: 'b', text: 'Windows Defender SmartScreen.' },
      { id: 'c', text: 'El Planificador de tareas de Windows.' },
      { id: 'd', text: 'DirectX 12 Ultimate.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'VSS coordina con los VSS Writers del sistema operativo para pausar temporalmente escrituras y generar una instantánea consistente a nivel de bloques que puede ser leída sin interferir con los procesos activos.',
    relatedInvestigationCode: '13.19'
  }
];

export const SECTOR_13_DATA = {
  sectorId: 'sector-13',
  sectorNumber: '13',
  title: 'INSTALAR, REINSTALAR Y RECUPERAR WINDOWS',
  subtitle: 'Instalación, reinstalación y recuperación',
  level: 'NIVEL II',
  levelTitle: 'ADMINISTRAR WINDOWS',
  investigationsCount: 20,
  artefactOrLab: 'Lab: Windows Installation & Recovery Simulator',
  investigations: SECTOR_13_INVESTIGATIONS,
  miniCases: SECTOR_13_MINICASES,
  testBank: SECTOR_13_TEST_BANK,
};
