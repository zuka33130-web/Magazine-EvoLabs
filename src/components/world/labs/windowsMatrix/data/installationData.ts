// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS INSTALLATION LAB DATA — "DE UN DISCO VACÍO A WINDOWS FUNCIONAL"
// Simulated Virtual Disk & Realistic Setup Engine
// ============================================================================

import { DiskPartitionItem } from '../engine/types';

export interface InstallStepDefinition {
  id: string;
  stepNumber: number;
  title: string;
  phase: 'PRE_BOOT' | 'SETUP_WIZARD' | 'DISK_MANAGER' | 'FILE_COPY' | 'OOBE' | 'POST_INSTALL';
  description: string;
  pedagogicalPrompt: string;
  evoExplains: string;
  simulatedScreen: string;
  actionRequired: string;
}

export interface InstallErrorChallenge {
  id: string;
  title: string;
  code: string;
  symptom: string;
  errorDialogText: string;
  rootCause: string;
  availableFixOptions: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  resolutionSummary: string;
}

export const INITIAL_VIRTUAL_DISK_PARTITIONS: DiskPartitionItem[] = [
  {
    id: 'part-unallocated',
    name: 'Espacio sin asignar en la unidad 0',
    sizeMb: 976762, // ~953.8 GB (1 TB Decimal / Binary 953.8 GiB)
    type: 'UNALLOCATED',
    fileSystem: 'RAW',
    purpose: 'Espacio físico virgen en el controlador NVMe sin tablas de particiones lógicas.',
    isBootable: false,
    canDelete: false,
    canFormat: false,
    explanation: {
      simple: 'Es un disco completamente vacío, como recién sacado de su caja en la tienda.',
      detailed: 'No contiene sectores de cabecera GPT ni tabla de asignación LBA. Cualquier instalación limpia debe inicializar una tabla de particiones GUID (GPT) en este espacio.',
      whyNeeded: 'Permite que el instalador de Windows o el técnico creen la estructura de particiones necesaria desde cero.'
    }
  }
];

export const STANDARD_WINDOWS_GPT_PARTITIONS: DiskPartitionItem[] = [
  {
    id: 'part-esp',
    name: 'Unidad 0 Partición 1: Sistema (ESP)',
    sizeMb: 260,
    type: 'ESP',
    fileSystem: 'FAT32',
    purpose: 'Partición del Sistema EFI. Aloja el gestor de arranque de Windows (bootmgfw.efi) y el almacén BCD.',
    isBootable: true,
    canDelete: true,
    canFormat: true,
    explanation: {
      simple: 'Esta es la partición EFI. No contiene tus fotos ni documentos. Contiene los archivos necesarios para que la placa madre sepa cómo arrancar Windows.',
      detailed: 'Utiliza el sistema de archivos FAT32 estandarizado por la especificación UEFI. La placa madre lee esta partición antes de que Windows exista en la memoria.',
      whyNeeded: 'Sin esta partición, la placa madre UEFI jamás podrá encontrar el archivo bootmgfw.efi y la PC quedará atrapada en la BIOS.'
    }
  },
  {
    id: 'part-msr',
    name: 'Unidad 0 Partición 2: Reservada (MSR)',
    sizeMb: 16,
    type: 'MSR',
    fileSystem: 'RAW',
    purpose: 'Partición reservada de Microsoft (MSR). Espacio para operaciones internas de gestión de discos.',
    isBootable: false,
    canDelete: true,
    canFormat: false,
    explanation: {
      simple: 'Es una pequeña porción de 16 megabytes que Windows se reserva para sí mismo para mover datos internos si convertís el disco.',
      detailed: 'Microsoft Reserved Partition. No tiene letra de unidad ni sistema de archivos formateado. Se utiliza si el volumen se convierte de disco básico a dinámico o para operaciones de BitLocker.',
      whyNeeded: 'Garantiza que Windows no tenga que robar espacio a otras particiones si requiere reestructurar bloques en el disco.'
    }
  },
  {
    id: 'part-windows',
    name: 'Unidad 0 Partición 3: Windows (C:)',
    sizeMb: 975500,
    type: 'WINDOWS',
    fileSystem: 'NTFS',
    purpose: 'Partición principal del sistema operativo. Contiene C:\\Windows, Archivos de Programa y datos de usuarios.',
    isBootable: false,
    canDelete: true,
    canFormat: true,
    explanation: {
      simple: 'Acá vive Windows, tus juegos, tus programas y todos tus documentos personales.',
      detailed: 'Formateada obligatoriamente en NTFS con clústeres de 4096 bytes (4 KB). Aloja el kernel NT, los controladores, el almacén WinSxS y la base de datos de seguridad SAM.',
      whyNeeded: 'Es el contenedor principal de datos y programas del sistema operativo.'
    }
  },
  {
    id: 'part-recovery',
    name: 'Unidad 0 Partición 4: Recuperación (WinRE)',
    sizeMb: 986,
    type: 'RECOVERY',
    fileSystem: 'NTFS',
    purpose: 'Entorno de Recuperación de Windows (WinRE). Aloja la imagen mínima winre.wim para reparar el sistema.',
    isBootable: true,
    canDelete: true,
    canFormat: true,
    explanation: {
      simple: 'Es un mini-Windows de emergencia que se despierta cuando el Windows principal no puede arrancar o se corta la luz.',
      detailed: 'Contiene una imagen compacta de Windows PE (winre.wim) con herramientas de reparación: Símbolo del Sistema, Restaurar Sistema, Desinstalar Actualizaciones y Reparación de Inicio.',
      whyNeeded: 'Permite reparar el equipo sin necesidad de tener un pendrive USB conectado a mano.'
    }
  }
];

export const INSTALL_CHALLENGES: InstallErrorChallenge[] = [
  {
    id: 'err-mbr-vs-gpt',
    title: 'Conflicto de Tabla de Particiones: MBR vs GPT',
    code: '0x80300024 // DISK_IS_MBR',
    symptom: 'Windows no se puede instalar en este disco. El disco seleccionado tiene una tabla de partición MBR. En sistemas EFI, Windows solo se puede instalar en discos GPT.',
    errorDialogText: 'Windows cannot be installed to this disk. The selected disk has an MBR partition table. On EFI systems, Windows can only be installed to GPT disks.',
    rootCause: 'El disco fue inicializado en una computadora antigua con BIOS heredada (Legacy MBR), pero la máquina actual arrancó en modo nativo UEFI de 64 bits.',
    availableFixOptions: [
      {
        id: 'fix-1',
        label: 'Formatear la partición NTFS existente',
        isCorrect: false,
        explanation: 'Incorrecto. Formatear la partición cambia los datos dentro del volumen, pero no modifica la tabla de particiones del disco físico (sigue siendo MBR).'
      },
      {
        id: 'fix-2',
        label: 'Presionar Shift+F10 ➔ diskpart ➔ select disk 0 ➔ clean ➔ convert gpt',
        isCorrect: true,
        explanation: '¡Correcto! El comando clean borra el sector MBR corrupto y convert gpt inicializa la estructura de particiones GUID que exige el estándar UEFI.'
      },
      {
        id: 'fix-3',
        label: 'Apagar la máquina y cambiar a modo IDE en la BIOS',
        isCorrect: false,
        explanation: 'Incorrecto. El modo IDE solo degrada la interfaz SATA y no soluciona el conflicto de tablas de particiones MBR vs GPT.'
      }
    ],
    resolutionSummary: 'Al convertir el disco a GPT, el instalador de Windows puede generar la partición del sistema EFI (ESP) requerida por el estándar de 64 bits.'
  },
  {
    id: 'err-storage-driver-missing',
    title: 'Controlador de Almacenamiento Ausente (No se encontraron unidades)',
    code: '0x80070057 // NO_DISKS_FOUND',
    symptom: 'La lista de discos aparece completamente en blanco: "No pudimos encontrar ninguna unidad. Para conseguir un controlador de almacenamiento, haz clic en Cargar controlador".',
    errorDialogText: 'We couldn\'t find any drives. To get a storage driver, click Load driver.',
    rootCause: 'La placa madre tiene activada la tecnología Intel VMD (Volume Management Device) o RAID, y el instalador genérico de Windows no incluye el controlador de bus RST en su imagen boot.wim.',
    availableFixOptions: [
      {
        id: 'fix-vmd-1',
        label: 'Hacer clic en "Cargar controlador" y apuntar a la carpeta con el driver VMD/RST descomprimido',
        isCorrect: true,
        explanation: '¡Correcto! Carga el archivo .inf del controlador en memoria para que Windows Setup reconozca el bus PCIe del SSD.'
      },
      {
        id: 'fix-vmd-2',
        label: 'Retirar el SSD de la ranura M.2 y ponerlo en la segunda ranura',
        isCorrect: false,
        explanation: 'Incorrecto. Ambas ranuras dependen del controlador VMD habilitado en el procesador.'
      },
      {
        id: 'fix-vmd-3',
        label: 'Reinstalar Windows en un disco mecánico USB externo',
        isCorrect: false,
        explanation: 'Incorrecto. Es una mala práctica que esquiva el problema sin solucionar el reconocimiento del almacenamiento nativo.'
      }
    ],
    resolutionSummary: 'Una vez cargado el controlador VMD o desactivada la opción en UEFI, el SSD NVMe aparece inmediatamente en la lista de particiones.'
  },
  {
    id: 'err-usb-loop',
    title: 'Bucle de Reinicio: El Instalador Vuelve a Comenzar desde Cero',
    code: 'SETUP_BOOT_LOOP // USB_PRIORITY',
    symptom: 'Tras completar la copia de archivos y reiniciar, la computadora vuelve a mostrar la pantalla inicial "Instalar ahora" y pide elegir idioma otra vez.',
    errorDialogText: 'Windows Setup: Language to install / Time and currency format / Keyboard or input method.',
    rootCause: 'La BIOS tiene el pendrive USB como primer dispositivo de arranque prioritario. Al reiniciar, la placa vuelve a bootear desde el USB en lugar de saltar al nuevo disco SSD.',
    availableFixOptions: [
      {
        id: 'fix-loop-1',
        label: 'Volver a formatear el disco y empezar de nuevo',
        isCorrect: false,
        explanation: 'Incorrecto. Windows ya fue copiado con éxito al SSD; hacer esto borra el progreso innecesariamente.'
      },
      {
        id: 'fix-loop-2',
        label: 'Desconectar el pendrive USB durante el reinicio de 10 segundos o seleccionar "Windows Boot Manager" en el menú de booteo',
        isCorrect: true,
        explanation: '¡Correcto! Al retirar el USB o forzar el arranque desde el SSD, Windows continúa con la fase de configuración de servicios y OOBE.'
      },
      {
        id: 'fix-loop-3',
        label: 'Apagar la máquina con el botón de la fuente',
        isCorrect: false,
        explanation: 'Incorrecto. Puede corromper los archivos recién copiados en el volumen NTFS.'
      }
    ],
    resolutionSummary: 'Los instaladores de Windows solo necesitan el pendrive en la Fase 1. A partir del primer reinicio, la máquina debe arrancar desde el SSD.'
  },
  {
    id: 'err-tpm-secure-boot',
    title: 'Requisitos de Hardware: Este Equipo No Puede Ejecutar Windows 11',
    code: 'TPM_SECUREBOOT_NOT_MET',
    symptom: 'El instalador se detiene antes de mostrar los discos: "Este equipo no cumple actualmente con los requisitos mínimos de sistema para ejecutar Windows 11".',
    errorDialogText: 'This PC can\'t run Windows 11. This PC doesn\'t meet the minimum system requirements to install this version of Windows.',
    rootCause: 'El módulo TPM 2.0 (fTPM/PTT) o el arranque seguro (Secure Boot) están deshabilitados en la configuración de la placa madre.',
    availableFixOptions: [
      {
        id: 'fix-tpm-1',
        label: 'Ingresar a la BIOS/UEFI y activar fTPM (AMD) o PTT (Intel) junto con Secure Boot en modo Estándar',
        isCorrect: true,
        explanation: '¡Correcto! Es la solución oficial que habilita los chips criptográficos por hardware exigidos por Microsoft.'
      },
      {
        id: 'fix-tpm-2',
        label: 'Formatear la placa madre',
        isCorrect: false,
        explanation: 'Las placas madre no se formatean; es una confusión terminológica.'
      },
      {
        id: 'fix-tpm-3',
        label: 'Usar Shift+F10 ➔ regedit ➔ LabConfig (BypassTPMCheck) si es una estación pericial de pruebas',
        isCorrect: true,
        explanation: '¡Correcto en laboratorio! Permite continuar la instalación en máquinas virtuales o equipos de diagnóstico controlados.'
      }
    ],
    resolutionSummary: 'Al activar fTPM/PTT en el procesador, Windows 11 valida la firma criptográfica y continúa con la selección de ediciones.'
  }
];

export const POST_INSTALL_BASELINE_TASKS = [
  {
    id: 'task-win-update',
    name: 'Windows Update // Parches de Seguridad Acumulativos',
    type: 'UPDATE',
    importance: 'CRÍTICA',
    description: 'Descarga de parches acumulativos KB y firmas criptográficas actualizadas.',
    status: 'pending'
  },
  {
    id: 'task-chipset',
    name: 'Controlador de Chipset de Placa Madre (Intel INF / AMD Chipset Driver)',
    type: 'DRIVER',
    importance: 'CRÍTICA',
    description: 'Permite que el kernel reconozca las líneas PCIe, controladores de energía y el despachador de hilos heterogéneo.',
    status: 'pending'
  },
  {
    id: 'task-gpu',
    name: 'Controlador Gráfico DCH (NVIDIA Studio/GameReady o AMD Adrenalin)',
    type: 'DRIVER',
    importance: 'ALTA',
    description: 'Instala el controlador de pantalla WDDM 3.1+ con aceleración de hardware para DWM y DirectX 12 Ultimate.',
    status: 'pending'
  },
  {
    id: 'task-audio-lan',
    name: 'Controladores de Red y Audio (Realtek / Intel LAN)',
    type: 'DRIVER',
    importance: 'MEDIA',
    description: 'Configura el búfer de reproducción de audio y los parámetros de ahorro de energía Energy Efficient Ethernet.',
    status: 'pending'
  },
  {
    id: 'task-device-manager',
    name: 'Auditoría en Administrador de Dispositivos (Cero signos amarillos)',
    type: 'VERIFICATION',
    importance: 'OBLIGATORIA',
    description: 'Comprobación de que no existan dispositivos desconocidos ni controladores con código de error 10 o 43.',
    status: 'pending'
  },
  {
    id: 'task-restore-point',
    name: 'Creación de Punto de Restauración del Sistema // Baseline Inicial',
    type: 'SAFETY',
    importance: 'OBLIGATORIA',
    description: 'Punto de salvaguarda "EVO LABS // BASELINE_01_WINDOWS_LIMPIO" antes de instalar software de usuario.',
    status: 'pending'
  }
];
