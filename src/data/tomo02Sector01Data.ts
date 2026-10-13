// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 01: ANTES DEL LOGO // TODO LO QUE PASA ANTES DE QUE WINDOWS EXISTA

export type ProvenanceType =
  | 'USER_DECLARED'
  | 'SYSTEM_REPORTED'
  | 'OBSERVED'
  | 'MEASURED'
  | 'DERIVED'
  | 'SIMULATED'
  | 'UNKNOWN';

export type ChallengeType =
  | 'ORDER_SEQUENCE'
  | 'CLASSIFICATION'
  | 'MYTH_VS_TRUTH'
  | 'STAGE_ISOLATION'
  | 'DIAGNOSTIC_DECISION'
  | 'REASONING';

export interface Sector01Investigation {
  id: string;
  code: string; // "01.01" to "01.27"
  title: string;
  subtitle: string;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    title: string;
    explanation: string[];
    diagramLabel?: string;
    diagramItems?: { label: string; desc: string }[];
  };
  profundiza: {
    title: string;
    technicalDetails: string[];
    lowLevelNote?: string;
  };
  miraloEnTuPc: {
    actionName: string;
    steps: string[];
    commandOrPath?: string;
    shortcut?: string;
    expectedVisual: string;
  };
  comprobalo: {
    instruction: string;
    actionPrompt: string;
    validationKey: string;
  };
  microdesafio: {
    type: ChallengeType;
    question: string;
    instruction: string;
    options?: { id: string; text: string; isCorrect: boolean; feedback: string }[];
    sortableItems?: { id: string; text: string; correctIndex: number }[];
  };
  evidencia: {
    fieldName: string;
    targetDescription: string;
    defaultProvenance: ProvenanceType;
    isBootArtifactField?: boolean;
  };
}

export interface Sector01MythTruth {
  id: string;
  afirmacion: string;
  mecanismo: string;
  comprobacion: string;
  veredicto: 'MENTIRA' | 'VERDAD' | 'DEPENDE';
}

// 8+ MENTIRAS Y VERDADES OFICIALES DEL SECTOR 01
export const SECTOR_01_MYTHS_AND_TRUTHS: Sector01MythTruth[] = [
  {
    id: 'myth-01',
    afirmacion: '“Si la PC no inicia Windows, el problema es que Windows está roto.”',
    mecanismo: 'El fallo puede ocurrir en etapas físicas (fuente, VRM), en POST, en firmware UEFI o en la tabla de particiones antes de que Windows sea cargado.',
    comprobacion: 'Inspeccionar si el hardware supera el POST y si el firmware detecta el disco y la entrada Windows Boot Manager.',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-02',
    afirmacion: '“BIOS y UEFI son exactamente lo mismo con diferente diseño estético.”',
    mecanismo: 'BIOS opera en modo real de 16 bits con límite MBR de 2.2 TB. UEFI es un entorno operativo modular de 32/64 bits con soporte GPT, drivers EFI y Secure Boot.',
    comprobacion: 'Consultar `msinfo32` > "Modo de BIOS" para verificar si corre en UEFI nativo o Heredado.',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-03',
    afirmacion: '“Fast Boot de la UEFI y Fast Startup de Windows son la misma tecnología.”',
    mecanismo: 'Fast Boot de UEFI omite la inicialización de puertos USB/dispositivos secundarios en el POST. Fast Startup de Windows hiberna el núcleo (kernel session) en `hiberfil.sys`.',
    comprobacion: 'Desactivar Fast Boot en BIOS no altera la configuración de Inicio Rápido en el Panel de Control de Windows.',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-04',
    afirmacion: '“Secure Boot es un software antivirus que escanea tus archivos en segundo plano.”',
    mecanismo: 'Secure Boot es un protocolo de firma digital en firmware que valida únicamente binarios pre-boot (.efi) contra certificados en NVRAM (PK, KEK, db).',
    comprobacion: 'Verificar en PowerShell: `Confirm-SecureBootUEFI` devuelve True/False sin consumir ciclos de CPU en el escritorio.',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-05',
    afirmacion: '“El chip TPM guarda todas las contraseñas de tus cuentas y páginas web.”',
    mecanismo: 'El TPM genera y almacena llaves criptográficas asimétricas y mediciones de integridad de la plataforma (PCRs) para BitLocker y Windows Hello.',
    comprobacion: 'Abrir `tpm.msc` para observar el estado del microprocesador criptográfico y su versión de especificación (2.0).',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-06',
    afirmacion: '“Activar XMP / EXPO es una opción de software dentro de la Configuración de Windows.”',
    mecanismo: 'Los perfiles XMP/EXPO residen en la EEPROM SPD de los módulos de RAM y se configuran exclusivamente en el firmware UEFI de la placa madre.',
    comprobacion: 'Comparar la velocidad JEDEC base en el Administrador de Tareas vs el perfil aplicado en el firmware.',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-07',
    afirmacion: '“Borrar la partición pequeña de 100 MB que no tiene letra libera espacio sin consecuencias.”',
    mecanismo: 'Esa partición es la partición del sistema EFI (ESP). Contiene `bootmgfw.efi` y la base BCD. Borrarla impedirá el arranque del sistema operativo.',
    comprobacion: 'Abrir `diskmgmt.msc` y observar el rótulo "Partición del sistema EFI (Correcto)".',
    veredicto: 'MENTIRA',
  },
  {
    id: 'myth-08',
    afirmacion: '“Apenas presiono el botón POWER, el kernel de Windows toma el control inmediato de la PC.”',
    mecanismo: 'Existe una cadena previa de 8 etapas: Fuente > Reset CPU > Firmware > POST > Selección Boot > Partición EFI > Windows Boot Manager > BCD > winload.efi.',
    comprobacion: 'Medir el tiempo de POST en la pestaña "Inicio" del Administrador de Tareas (Última hora de BIOS).',
    veredicto: 'MENTIRA',
  },
];

// TUTOR EVO TIPS PARA SECTOR 01
export const SECTOR_01_TUTOR_ADVICE: { condition: string; tip: string }[] = [
  {
    condition: 'initial',
    tip: '“Windows todavía no apareció. Pero la PC ya tomó decisiones que determinarán todo lo que ocurra después. Sigamos el arranque paso a paso.”',
  },
  {
    condition: 'uefi_step',
    tip: '“Que el disco rígido aparezca en la lista de dispositivos no garantiza que la entrada Windows Boot Manager esté intacta en la NVRAM.”',
  },
  {
    condition: 'efi_step',
    tip: '“No toques la partición EFI. Su tamaño pequeño de 100 MB contiene los binarios críticos de los cuales depende la vida de tu sistema.”',
  },
  {
    condition: 'drivers_step',
    tip: '“Si Windows no puede inicializar el driver de la controladora de almacenamiento (AHCI/NVMe), el resultado será INACCESSIBLE_BOOT_DEVICE antes de llegar al login.”',
  },
  {
    condition: 'explorer_step',
    tip: '“Si llegás a ver el cursor del mouse sobre pantalla negra tras el login, el kernel y los servicios ya arrancaron: el problema está limitado al shell explorer.exe.”',
  },
];
