// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 01: 27 INVESTIGACIONES TÉCNICAS (01.01 → 01.27)

import { Sector01Investigation } from './tomo02Sector01Data';

export const SECTOR_01_INVESTIGATIONS: Sector01Investigation[] = [
  {
    id: 'inv-01-01',
    code: '01.01',
    title: '¿QUÉ SUCEDE EN EL PRIMER SEGUNDO TRAS POWER?',
    subtitle: 'La física de la señal eléctrica y el vector de reset de la CPU',
    descubri: {
      hook: 'Al presionar el botón POWER en el gabinete, parece que la máquina enciende al instante. En realidad, la placa madre retiene al procesador en estado congelado (RESET) hasta que los voltajes de la fuente son 100% estables.',
      mythVsTruth: {
        mentira: '“Apenas aprieto POWER, Windows empieza a cargar en memoria.”',
        verdad: 'Durante este primer segundo Windows no tiene ningún control de la computadora. La fuente y el chipset gobiernan el hardware.',
        comprobalo: 'Medí el retardo entre presionar el botón y el primer destello del teclado o pantalla de logo.',
      },
    },
    entende: {
      title: 'La Secuencia Eléctrica Primaria',
      explanation: [
        '1. La fuente de poder recibe la señal PS_ON# y levanta los rieles (+12V, +5V, +3.3V).',
        '2. Cuando los voltajes se estabilizan, la fuente envía la señal PWR_OK (Power Good) a la placa madre.',
        '3. El chipset libera la línea RESET# del procesador.',
        '4. La CPU ejecuta su primera instrucción en el Vector de Reset apuntando a la memoria flash del firmware (SPI ROM).',
      ],
      diagramLabel: 'SECUENCIA DE DISPARO',
      diagramItems: [
        { label: 'BOTÓN POWER', desc: 'Cierra circuito a masa (GND)' },
        { label: 'FUENTE ATX', desc: 'Estabiliza voltajes y envía PWR_OK' },
        { label: 'CPU RESET# LIBERADO', desc: 'El procesador despierta' },
        { label: 'VECTOR DE RESET', desc: 'Salta a la memoria flash del firmware' },
      ],
    },
    profundiza: {
      title: 'Por qué una fuente mala congela la PC antes de POST',
      technicalDetails: [
        'Si la señal PWR_OK oscila o tiene demasiado ruido eléctrico, la placa madre mantiene el procesador en estado de Reset indefinido.',
        'Los ventiladores girarán al 100%, pero la pantalla permanecerá en negro absoluto porque la CPU nunca llega a ejecutar el código del firmware.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Observar la actividad eléctrica inicial',
      steps: [
        '1. Al encender la PC, observá cómo los ventiladores hacen un giro inicial antes de estabilizarse.',
        '2. Los LEDs de diagnóstico (Debug LEDs) en placas modernas se iluminan secuencialmente: CPU > DRAM > VGA > BOOT.',
      ],
      expectedVisual: 'Encendido de indicadores de energía previos al logo en pantalla.',
    },
    comprobalo: {
      instruction: 'Identificá quién tiene el control absoluto de la computadora durante el primer segundo.',
      actionPrompt: 'Seleccioná la entidad que gobierna el hardware en el instante inicial.',
      validationKey: 'FIRST_SECOND_ACTOR_VALIDATED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Quién está al mando de la computadora durante el primer segundo después de presionar el botón de encendido?',
      instruction: 'Seleccioná la respuesta correcta:',
      options: [
        { id: 'a1', text: 'El hardware eléctrico y el firmware (UEFI / Chipset) de la placa madre.', isCorrect: true, feedback: '¡Correcto! Windows todavía ni siquiera ha sido leído del disco.' },
        { id: 'a2', text: 'El Kernel de Windows (ntoskrnl.exe).', isCorrect: false, feedback: 'Incorrecto: Windows aún no existe en la memoria RAM.' },
        { id: 'a3', text: 'El Explorador de Windows (explorer.exe).', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'a4', text: 'El usuario.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'BOOT_STAGE_01_POWER_OK',
      targetDescription: 'Validación de la secuencia de encendido y señal PWR_OK',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-02',
    code: '01.02',
    title: 'POST: LA PC SE EXAMINA A SÍ MISMA',
    subtitle: 'El auto-test de hardware esencial antes de buscar un sistema operativo',
    descubri: {
      hook: 'El Power-On Self-Test (POST) es el examen médico que el procesador se aplica a sí mismo y a sus componentes vitales. Si la RAM está mal insertada o la placa de video no responde, la máquina se detiene aquí.',
      mythVsTruth: {
        mentira: '“Si la PC no da video, seguro se corrompió Windows y hay que formatear.”',
        verdad: 'Si no hay video ni logo del fabricante, la falla ocurre durante el POST de hardware, mucho antes de intentar cargar cualquier archivo del disco.',
        comprobalo: 'Desconectar la RAM o GPU: la máquina emitirá pitidos o encenderá un LED de error sin tocar el disco rígido.',
      },
    },
    entende: {
      title: 'Qué Verifica el POST en Orden Estricto',
      explanation: [
        '1. Inicialización y registros internos de la CPU.',
        '2. Detección y entrenamiento de los módulos de memoria RAM (DRAM Training).',
        '3. Inicialización del bus PCIe y controlador de video primario (VGA).',
        '4. Detección de buses de almacenamiento (SATA / NVMe PCIe) y periféricos de entrada (Teclado/Mouse).',
      ],
    },
    profundiza: {
      title: 'Códigos de Diagnóstico (Beep Codes & Debug LEDs)',
      technicalDetails: [
        'El buzzer de la placa madre emite patrones sonoros codificados según el fabricante del firmware (AMI, Phoenix, Insyde).',
        'Las placas modernas incluyen paneles de 2 dígitos de 7 segmentos (Q-Code / Debug Code) que muestran el código hexadecimal de la fase POST exacta.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Observar el tiempo de POST en el Administrador de Tareas',
      steps: [
        '1. Presioná Ctrl + Shift + Esc para abrir el Administrador de Tareas.',
        '2. Andá a la pestaña “Inicio” (o Aplicaciones de inicio).',
        '3. En la esquina superior derecha, leé el valor: “Última hora de BIOS” (ej. 8.4 segundos).',
      ],
      shortcut: 'Ctrl + Shift + Esc → Inicio',
      expectedVisual: 'Métrica en segundos que tardó el hardware en completar el POST antes de transferir control a Windows.',
    },
    comprobalo: {
      instruction: 'Anotá el tiempo de BIOS (POST) reportado en tu máquina.',
      actionPrompt: 'Registrá la métrica de POST en el expediente.',
      validationKey: 'POST_TIME_RECORDED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Una computadora enciende, los ventiladores giran a máxima velocidad, la pantalla queda en negro y la placa madre emite 3 pitidos cortos. ¿Tiene sentido reinstalar Windows para solucionar este problema?',
      instruction: 'Elegí el razonamiento pericial:',
      options: [
        { id: 'p1', text: 'NO: El fallo ocurre durante el POST de hardware (falla en RAM o GPU). Windows ni siquiera ha comenzado a cargarse.', isCorrect: true, feedback: '¡Exacto! El diagnóstico es 100% de banco de hardware/firmware.' },
        { id: 'p2', text: 'SÍ: Reinstalar Windows repara los archivos del disco.', isCorrect: false, feedback: 'Incorrecto: La PC no llega a leer el disco.' },
      ],
    },
    evidencia: {
      fieldName: 'LAST_BIOS_TIME_SEC',
      targetDescription: 'Tiempo de ejecución del POST de firmware en segundos',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-03',
    code: '01.03',
    title: 'BIOS vs UEFI: EL MUNDO ANTES DEL SISTEMA OPERATIVO',
    subtitle: 'La transición histórica de los 16 bits en modo real al entorno modular de 64 bits',
    descubri: {
      hook: 'La BIOS original fue diseñada por IBM en 1981 con chips de 16 bits y un límite de particiones de 2.2 TB. UEFI (Unified Extensible Firmware Interface) es prácticamente un mini sistema operativo con drivers propios, red y soporte de discos de millones de Terabytes.',
      mythVsTruth: {
        mentira: '“UEFI es simplemente una BIOS con un menú gráfico para usar el mouse.”',
        verdad: 'UEFI es una especificación modular completa en 32/64 bits que ejecuta aplicaciones y controladores EFI independientes del sistema operativo.',
        comprobalo: 'Revisá en `msinfo32` el campo “Modo de BIOS”: dirá “UEFI” en sistemas modernos.',
      },
    },
    entende: {
      title: 'Comparativa Estructural',
      explanation: [
        '• BIOS Legacy: Ejecución en 16 bits (Modo Real). Límite de 1 MB de direccionamiento. Tabla de particiones MBR (máximo 4 particiones primarias, límite de 2.2 TB por disco).',
        '• UEFI: Ejecución nativa en 32/64 bits. Tabla de particiones GPT (GUID Partition Table, hasta 128 particiones y discos de 9.4 Zettabytes). Soporte de Secure Boot y NVRAM.',
      ],
    },
    profundiza: {
      title: 'El Entorno Pre-Boot de UEFI',
      technicalDetails: [
        'UEFI puede cargar controladores de red, acceder a internet y actualizar su propio firmware sin que exista ningún disco duro instalado.',
        'Los fabricantes pueden crear herramientas de diagnóstico completas dentro de la memoria flash de la placa madre.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Verificar el Modo de Firmware en msinfo32',
      steps: [
        '1. Presioná Win + R, escribí `msinfo32` y presioná Enter.',
        '2. En el Resumen del sistema, buscá el campo “Modo de BIOS”.',
      ],
      commandOrPath: 'msinfo32',
      shortcut: 'Win + R → msinfo32',
      expectedVisual: 'Campo indicando "UEFI" o "Heredado".',
    },
    comprobalo: {
      instruction: 'Confirmá si tu sistema opera bajo UEFI o BIOS Heredado.',
      actionPrompt: 'Registrá el modo de firmware en el mapa de arranque.',
      validationKey: 'FIRMWARE_MODE_RECORDED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: '¿Cuál de las siguientes capacidades pertenece exclusivamente a UEFI y no a la BIOS tradicional?',
      instruction: 'Identificá la característica moderna:',
      options: [
        { id: 'u1', text: 'Soporte nativo de GPT para discos de más de 2.2 TB y arranque seguro Secure Boot.', isCorrect: true, feedback: '¡Correcto! GPT y Secure Boot son pilares de la especificación UEFI.' },
        { id: 'u2', text: 'Lectura de sectores MBR de 512 bytes.', isCorrect: false, feedback: 'Incorrecto: Eso pertenece a la BIOS Legacy.' },
        { id: 'u3', text: 'Uso de disquetes de 1.44 MB.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'FIRMWARE_MODE',
      targetDescription: 'Modo de operación del firmware (UEFI / Legacy)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-04',
    code: '01.04',
    title: 'FIRMWARE: SOFTWARE ESCONDIDO EN EL SILICIO',
    subtitle: 'El código permanente grabado en chips de memoria flash EEPROM',
    descubri: {
      hook: 'Tu placa madre, tu tarjeta gráfica, tu SSD y hasta tu teclado tienen sus propios procesadores y su propio software interno. Ese software se llama Firmware y vive grabado en chips de memoria física.',
      mythVsTruth: {
        mentira: '“Cuando formateo el disco de la PC, borro todo el software de la máquina.”',
        verdad: 'Formatear borra el sistema operativo del almacenamiento, pero el firmware de la placa madre, de la GPU y de los periféricos permanece intacto en sus chips flash.',
        comprobalo: 'Encendé la PC sin ningún disco conectado: podrás entrar al menú de configuración del firmware sin problemas.',
      },
    },
    entende: {
      title: 'Taxonomía de Software de Bajo Nivel',
      explanation: [
        '• Firmware: Código residente en memoria no volátil (SPI Flash) del hardware.',
        '• Controlador (Driver): Módulo de software que corre en Windows para hablar con ese hardware.',
        '• Sistema Operativo: La plataforma que arbitra procesos y memoria.',
        '• Aplicación: El programa que interactúa con el usuario final.',
      ],
    },
    profundiza: {
      title: 'Actualizaciones de BIOS/UEFI (Flashing)',
      technicalDetails: [
        'Actualizar el firmware sobreescribe el chip EEPROM SPI de la placa madre.',
        'Un corte de energía durante este proceso puede dejar el chip corrupto (Brick), a menos que la placa incluya tecnología de recuperación por hardware (BIOS Flashback / Dual BIOS).',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la versión de BIOS instalada',
      steps: [
        '1. Presioná Win + R, escribí `msinfo32` y mirá el campo “Versión y fecha de BIOS”.',
        '2. O abrí PowerShell y escribí: `Get-CimInstance Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate`',
      ],
      commandOrPath: 'Get-CimInstance Win32_BIOS',
      expectedVisual: 'Fabricante, versión de versión y fecha de compilación del firmware de la placa.',
    },
    comprobalo: {
      instruction: 'Anotá la versión y fecha de tu firmware BIOS/UEFI.',
      actionPrompt: 'Registrá la versión del firmware en el expediente.',
      validationKey: 'BIOS_VERSION_RECORDED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: 'Clasificá correctamente cada elemento en su nivel técnico:',
      instruction: 'Diferenciá firmware de drivers y aplicaciones:',
      options: [
        { id: 'f1', text: 'Código en chip SPI ROM de la Motherboard → Firmware UEFI', isCorrect: true, feedback: 'Correcto: Firmware de hardware.' },
        { id: 'f2', text: 'nvlddmkm.sys en System32 → Driver de Kernel de GPU', isCorrect: true, feedback: 'Correcto: Driver de Windows.' },
        { id: 'f3', text: 'Chrome.exe → Aplicación en User Mode', isCorrect: true, feedback: 'Correcto: Software de usuario.' },
      ],
    },
    evidencia: {
      fieldName: 'BIOS_VERSION_AND_DATE',
      targetDescription: 'Versión y fecha de lanzamiento del firmware de la placa madre',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-05',
    code: '01.05',
    title: 'SECURE BOOT: ¿QUIÉN DECIDE QUÉ PUEDE ARRANCAR?',
    subtitle: 'La cadena de confianza criptográfica que previene bootkits en Ring 0',
    descubri: {
      hook: 'Si un malware lograra modificarte el archivo de arranque antes de que cargue Windows, el antivirus no podría detectarlo porque el virus se iniciaría antes que el sistema de seguridad. Secure Boot existe para impedir este escenario.',
      mythVsTruth: {
        mentira: '“Secure Boot es una traba de Microsoft para que no puedas usar Linux ni cambiar de sistema.”',
        verdad: 'Secure Boot es un estándar de la industria que valida que el gestor de arranque esté firmado con certificados criptográficos de confianza (PK, KEK, db). Las principales distribuciones de Linux soportan Secure Boot nativamente.',
        comprobalo: 'Verificá en `msinfo32` el "Estado de inicio seguro": dirá "Activado" o "Desactivado".',
      },
    },
    entende: {
      title: 'La Cadena de Confianza (Chain of Trust)',
      explanation: [
        '1. Llave de Plataforma (PK): Perteneciente al fabricante de la placa madre.',
        '2. Llave de Intercambio de Claves (KEK): Autoriza qué entidades pueden actualizar la base de firmas.',
        '3. Base de Datos de Firmas Permitidas (db): Contiene las firmas de Microsoft Windows y de la CA de terceros.',
        '4. Base de Datos de Firmas Prohibidas (dbx): Lista negra de binarios vulnerables o bootkits conocidos.',
      ],
    },
    profundiza: {
      title: 'Cómo Detiene a los Bootkits',
      technicalDetails: [
        'Cuando el firmware lee `bootmgfw.efi` de la partición ESP, calcula su hash criptográfico SHA-256 y verifica su firma digital contra la base de datos `db`.',
        'Si el archivo fue manipulado por un rootkit, el hash no coincide y el firmware aborta el arranque de inmediato.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el estado de Secure Boot en PowerShell',
      steps: [
        '1. Presioná Win + X y abrí Terminal / PowerShell.',
        '2. Escribí `Confirm-SecureBootUEFI` y presioná Enter.',
      ],
      commandOrPath: 'Confirm-SecureBootUEFI',
      expectedVisual: 'True (Activado) o False (Desactivado).',
    },
    comprobalo: {
      instruction: 'Determiná si Secure Boot está activado en tu máquina.',
      actionPrompt: 'Registrá el estado de Secure Boot en el mapa.',
      validationKey: 'SECURE_BOOT_STATUS_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué ocurre si un atacante reemplaza el cargador de arranque de Windows por uno modificado sin firma válida en una máquina con Secure Boot activado?',
      instruction: 'Seleccioná la consecuencia técnica:',
      options: [
        { id: 'sb1', text: 'El firmware UEFI rechaza ejecutar el binario y detiene el arranque mostrando un error de violación de seguridad.', isCorrect: true, feedback: '¡Exacto! El firmware no transfiere el control a código no firmado.' },
        { id: 'sb2', text: 'Windows arranca más lento pero lo ejecuta igual.', isCorrect: false, feedback: 'Incorrecto: La ejecución es bloqueada totalmente.' },
        { id: 'sb3', text: 'La placa madre se autodestruye.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SECURE_BOOT_STATUS',
      targetDescription: 'Estado de Arranque Seguro (Enabled / Disabled / Unsupported)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-06',
    code: '01.06',
    title: 'TPM: EL CHIP QUE GUARDA SECRETOS CRIPTOGRÁFICOS',
    subtitle: 'El microprocesador de seguridad dedicado y la raíz de confianza de la plataforma',
    descubri: {
      hook: 'Windows 11 exige TPM 2.0. Mucha gente pensó que era un capricho, pero el TPM (Trusted Platform Module) es el cofre de seguridad físico donde se guardan las llaves maestras de cifrado de BitLocker y las credenciales biométricas de Windows Hello.',
      mythVsTruth: {
        mentira: '“El TPM es un chip espía que recopila tu historial de navegación.”',
        verdad: 'El TPM es un procesador criptográfico pasivo que calcula hashes y almacena llaves privadas que NUNCA salen del chip en texto plano.',
        comprobalo: 'Presioná Win+R y escribí `tpm.msc` para ver la consola oficial de administración del TPM.',
      },
    },
    entende: {
      title: 'Tipos de TPM en la Práctica',
      explanation: [
        '• dTPM (Discrete TPM): Chip físico soldado en la placa madre.',
        '• fTPM (Firmware TPM): Implementación segura dentro del procesador principal (Intel PTT / AMD fTPM).',
        '• PCRs (Platform Configuration Registers): Registros especiales que miden el estado exacto del firmware y bootloader.',
      ],
    },
    profundiza: {
      title: 'Cómo Protege a BitLocker contra el Robo de Discos',
      technicalDetails: [
        'Si un ladrón extrae tu SSD y lo conecta a otra computadora, el TPM de tu placa madre no estará presente para entregar la llave de descifrado, y los datos serán ilegibles.',
        'Si alguien intenta alterar el firmware de tu placa, los valores de los PCR cambian y el TPM se niega a liberar la clave.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar la consola del TPM',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `tpm.msc` y presioná Enter.',
        '3. Revisá el "Estado" y la "Versión de la especificación" (2.0).',
      ],
      commandOrPath: 'tpm.msc',
      shortcut: 'Win + R → tpm.msc',
      expectedVisual: 'Consola indicando "El TPM está listo para su uso" con versión de especificación 2.0.',
    },
    comprobalo: {
      instruction: 'Verificá si tu equipo cuenta con TPM 2.0 activo.',
      actionPrompt: 'Registrá el estado del TPM en el expediente.',
      validationKey: 'TPM_STATUS_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué BitLocker se niega a desbloquear el disco automáticamente si se actualiza la BIOS sin pausar la protección?',
      instruction: 'Explicá la reacción del TPM:',
      options: [
        { id: 'tpm1', text: 'Porque el cambio de firmware alteró las mediciones de los registros PCR y el TPM detecta un cambio no autorizado en la cadena de arranque.', isCorrect: true, feedback: '¡Brillante! El TPM protege los datos sellándolos contra la firma exacta del firmware.' },
        { id: 'tpm2', text: 'Porque el disco se formatea al actualizar la BIOS.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TPM_VERSION_AND_STATUS',
      targetDescription: 'Versión del TPM (2.0 / 1.2) y estado de disponibilidad',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-07',
    code: '01.07',
    title: 'LEGACY / CSM: EL FANTASMA DE LA VIEJA BIOS',
    subtitle: 'El Módulo de Compatibilidad que mantiene con vida sistemas heredados',
    descubri: {
      hook: 'En el menú de tu placa madre suele existir una opción llamada "CSM" (Compatibility Support Module). Si la activás, tu moderna UEFI emula una BIOS de hace 30 años para poder arrancar discos MBR antiguos.',
      mythVsTruth: {
        mentira: '“Tener CSM activado hace que la PC sea más compatible y rápida.”',
        verdad: 'CSM inhabilita Secure Boot, desactiva funciones de arranque ultrarrápido y obliga a la GPU a usar emulación VBIOS heredada en lugar de drivers UEFI GOP nativos.',
        comprobalo: 'En Windows 11, CSM debe estar desactivado para cumplir con los estándares de seguridad modernos.',
      },
    },
    entende: {
      title: 'El Dilema de Compatibilidad',
      explanation: [
        '• CSM Activado: Permite arrancar sistemas operativos viejos de 32 bits y discos formateados en MBR.',
        '• CSM Desactivado (Pure UEFI): Modo nativo obligatorio para Windows 11, Resizable BAR, Secure Boot y aceleración GOP de video.',
      ],
    },
    profundiza: {
      title: 'Convertir MBR a GPT sin perder datos',
      technicalDetails: [
        'Windows incluye la herramienta oficial `mbr2gpt.exe` en System32 para convertir discos de arranque MBR a GPT sin formatear.',
        'Una vez convertido el disco, se debe desactivar CSM en el firmware para arrancar en UEFI nativo.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el estilo de partición del disco',
      steps: [
        '1. Presioná Win + X y seleccioná “Administración de discos”.',
        '2. Hacé clic derecho en "Disco 0" > Propiedades > Pestaña "Volúmenes".',
        '3. Mirá el "Estilo de partición": Tabla de particiones GUID (GPT).',
      ],
      commandOrPath: 'diskmgmt.msc',
      expectedVisual: 'Estilo de partición: GPT.',
    },
    comprobalo: {
      instruction: 'Confirmá que tu disco principal de sistema utiliza tabla GPT.',
      actionPrompt: 'Registrá el estilo de partición del disco del sistema.',
      validationKey: 'PARTITION_STYLE_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué una tarjeta gráfica moderna puede no dar imagen en el menú de la placa si CSM está activado en modo heredado estricto?',
      instruction: 'Identificá el conflicto de controladores pre-boot:',
      options: [
        { id: 'csm1', text: 'Porque las GPUs modernas carecen de VBIOS clásica de 16 bits y requieren el controlador UEFI GOP (Graphics Output Protocol) nativo.', isCorrect: true, feedback: '¡Exacto! Las GPUs contemporáneas están diseñadas para UEFI puro.' },
        { id: 'csm2', text: 'Porque el cable HDMI está sucio.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PARTITION_STYLE_GPT',
      targetDescription: 'Estilo de partición del almacenamiento primario (GPT / MBR)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-08',
    code: '01.08',
    title: 'UEFI BOOT: EL FLUJO MODERNO',
    subtitle: 'Cómo el firmware encuentra y ejecuta el cargador de arranque en el disco',
    descubri: {
      hook: 'En la vieja BIOS, la placa madre leía a ciegas el primer sector del disco (sector 0 de 512 bytes). En UEFI, la placa madre entiende el sistema de archivos FAT32, busca una partición especial y ejecuta un archivo binario `.efi`.',
      mythVsTruth: {
        mentira: '“El firmware de la placa no puede leer archivos de un disco; solo el sistema operativo puede.”',
        verdad: 'UEFI contiene controladores de sistema de archivos integrados que le permiten leer la partición EFI directamente.',
        comprobalo: 'La ruta canónica que busca el firmware es `\\EFI\\Microsoft\\Boot\\bootmgfw.efi` en la partición del sistema.',
      },
    },
    entende: {
      title: 'El Esquema del Flujo UEFI',
      explanation: [
        '1. La UEFI consulta la lista de entradas de arranque en la memoria NVRAM.',
        '2. Selecciona la entrada prioritaria (Windows Boot Manager).',
        '3. Mapea el GUID del disco y la partición del sistema EFI (ESP).',
        '4. Carga en memoria y ejecuta el archivo `bootmgfw.efi`.',
      ],
      diagramLabel: 'RUTA DE CARGA UEFI',
      diagramItems: [
        { label: 'NVRAM', desc: 'Contiene variables Boot0001, BootOrder' },
        { label: 'PARTICIÓN ESP', desc: 'Partición FAT32 oculta en el disco' },
        { label: 'BOOTMGFW.EFI', desc: 'Binario cargador de Windows' },
      ],
    },
    profundiza: {
      title: 'Variables NVRAM del Firmware',
      technicalDetails: [
        'A diferencia de la BIOS clásica, UEFI almacena las rutas de arranque como variables en memoria no volátil (NVRAM), no en un sector de arranque físico.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Consultar la entrada de arranque UEFI en PowerShell',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Escribí: `bcdedit /enum {bootmgr}` y mirá el valor de `path`.',
      ],
      commandOrPath: 'bcdedit /enum {bootmgr}',
      expectedVisual: '`path \\EFI\\Microsoft\\Boot\\bootmgfw.efi`',
    },
    comprobalo: {
      instruction: 'Confirmá la ruta del cargador de arranque en tu BCD.',
      actionPrompt: 'Registrá la ruta del boot manager en el mapa.',
      validationKey: 'BOOTMGFW_PATH_VERIFIED',
    },
    microdesafio: {
      type: 'STAGE_ISOLATION',
      question: '¿Qué archivo binario ejecuta directamente el firmware UEFI para iniciar el proceso de carga de Windows?',
      instruction: 'Identificá el binario exacto:',
      options: [
        { id: 'ue1', text: '\\EFI\\Microsoft\\Boot\\bootmgfw.efi', isCorrect: true, feedback: '¡Correcto! Es el Windows Boot Manager compilado para EFI.' },
        { id: 'ue2', text: 'explorer.exe', isCorrect: false, feedback: 'Incorrecto: explorer.exe se carga al final del proceso.' },
        { id: 'ue3', text: 'notepad.exe', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'UEFI_BOOTMGR_PATH',
      targetDescription: 'Ruta física del cargador UEFI en la partición ESP',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-09',
    code: '01.09',
    title: 'BOOT ORDER: ¿QUIÉN ENTRA PRIMERO?',
    subtitle: 'La lista de prioridades de arranque en NVRAM y dispositivos externos',
    descubri: {
      hook: 'Conectás un pendrive de fotos a la PC, la reiniciás y aparece una pantalla negra que dice "No bootable device". La computadora no está rota: simplemente intentó arrancar desde el pendrive porque tenía mayor prioridad.',
      mythVsTruth: {
        mentira: '“La PC siempre sabe cuál es el disco que tiene Windows y lo elige automáticamente.”',
        verdad: 'La PC sigue ciegamente el orden configurado en el Boot Order del firmware. Si un dispositivo sin sistema está primero, intentará arrancarlo.',
        comprobalo: 'Abrí el menú de arranque temporal (Boot Menu) presionando F11/F12 durante el encendido.',
      },
    },
    entende: {
      title: 'La Lista de Prioridades',
      explanation: [
        '1. Windows Boot Manager (Disco SSD interno NVMe).',
        '2. Unidades USB / Discos externos.',
        '3. Arranque por red (PXE / Network Boot).',
      ],
    },
    profundiza: {
      title: 'Diferencia entre Dispositivo Físico y Entrada UEFI',
      technicalDetails: [
        'En UEFI no se selecciona "Disco Kingston 500GB", sino la entrada lógica "Windows Boot Manager (Kingston 500GB)".',
        'Si seleccionás el disco físico en modo Legacy, fallará si Windows está instalado en GPT/UEFI.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar las entradas de arranque del firmware',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Escribí: `bcdedit /enum firmware` para listar todas las entradas de NVRAM.',
      ],
      commandOrPath: 'bcdedit /enum firmware',
      expectedVisual: 'Lista de identificadores `{fwbootmgr}` con su orden de arranque.',
    },
    comprobalo: {
      instruction: 'Asegurate de que Windows Boot Manager figure como primera opción en tu orden de arranque.',
      actionPrompt: 'Verificá la prioridad de arranque en tu expediente.',
      validationKey: 'BOOT_ORDER_VERIFIED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Un usuario tiene Windows instalado en el Disco 1, pero al conectar un disco secundario viejo en el Disco 2, la PC intenta arrancar una instalación antigua rota. ¿Cómo se soluciona técnicamente?',
      instruction: 'Elegí la acción pericial:',
      options: [
        { id: 'bo1', text: 'Entrar a la UEFI y colocar "Windows Boot Manager" del Disco 1 en el primer lugar de la prioridad de arranque (Boot Order).', isCorrect: true, feedback: '¡Exacto! El orden de arranque determina qué entrada se ejecuta primero.' },
        { id: 'bo2', text: 'Tirar el disco secundario a la basura.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'BOOT_ORDER_PRIORITY',
      targetDescription: 'Prioridad de arranque en firmware NVRAM',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-10',
    code: '01.10',
    title: 'FAST BOOT vs FAST STARTUP: ¿REALMENTE ACELERAN?',
    subtitle: 'Por qué no debés confundir el atajo del firmware con la hibernación del núcleo de Windows',
    descubri: {
      hook: 'Mucha gente cree que "Fast Boot" en la BIOS y "Fast Startup" en Windows son lo mismo. Son dos mecanismos completamente diferentes que operan en capas distintas y tienen consecuencias muy diferentes.',
      mythVsTruth: {
        mentira: '“Fast Boot de la BIOS y Fast Startup de Windows son la misma opción con nombres parecidos.”',
        verdad: 'Fast Boot de UEFI omite el chequeo de puertos USB en POST. Fast Startup de Windows guarda la sesión del kernel en disco (hibernación híbrida).',
        comprobalo: 'Al apagar Windows con Fast Startup activado, el tiempo de actividad de la CPU en el Administrador de Tareas no se reinicia a cero.',
      },
    },
    entende: {
      title: 'Las Dos Tecnologías Comparadas',
      explanation: [
        '• Fast Boot (Firmware UEFI): Acelera el POST omitiendo la enumeración exhaustiva de periféricos secundarios. Puede dificultar presionar F2/Del al encender.',
        '• Fast Startup (Windows): Al seleccionar "Apagar", Windows cierra las aplicaciones de usuario pero hiberna el kernel (`hiberfil.sys`), acelerando la carga del sistema operativo.',
      ],
    },
    profundiza: {
      title: 'Efectos Secundarios de Fast Startup',
      technicalDetails: [
        'Fast Startup puede bloquear particiones NTFS impidiendo su acceso desde otros sistemas operativos (Dual Boot Linux).',
        'Para forzar un reinicio limpio y purgar el kernel, siempre se debe usar "Reiniciar" o ejecutar `shutdown /r /t 0`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el tiempo de actividad de la CPU',
      steps: [
        '1. Abrí el Administrador de Tareas (Ctrl + Shift + Esc) > Rendimiento > CPU.',
        '2. Mirá el campo “Tiempo activo”. Si apagaste la PC anoche y dice "3 días", Fast Startup está activo.',
      ],
      shortcut: 'Ctrl + Shift + Esc → Rendimiento → CPU',
      expectedVisual: 'Tiempo activo acumulado de la sesión de kernel.',
    },
    comprobalo: {
      instruction: 'Comprendé si tu máquina utiliza hibernación de kernel al apagarse.',
      actionPrompt: 'Registrá la distinción de Fast Boot vs Fast Startup en tu expediente.',
      validationKey: 'FAST_STARTUP_AWARENESS',
    },
    microdesafio: {
      type: 'MYTH_VS_TRUTH',
      question: '¿Qué acción garantiza un reinicio 100% fresco del kernel de Windows sin cargar el estado hibernado de Fast Startup?',
      instruction: 'Seleccioná el procedimiento correcto:',
      options: [
        { id: 'fs1', text: 'Hacer clic en "Reiniciar" (o comando `shutdown /r /t 0`), ya que Reiniciar nunca utiliza hibernación rápida.', isCorrect: true, feedback: '¡Correcto! En Windows, "Reiniciar" purga completamente el estado y recarga el kernel desde cero.' },
        { id: 'fs2', text: 'Apagar y prender con el botón.', isCorrect: false, feedback: 'Incorrecto: Apagar usa Fast Startup si está activo.' },
      ],
    },
    evidencia: {
      fieldName: 'FAST_STARTUP_STATE',
      targetDescription: 'Estado de Inicio Rápido de Windows (Fast Startup)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-11',
    code: '01.11',
    title: 'VT-x / AMD-V: ABRÍ UNA PC DENTRO DE TU PC',
    subtitle: 'La virtualización por hardware en el procesador',
    descubri: {
      hook: 'Querés usar WSL (Subsistema de Windows para Linux), Windows Sandbox o VMware, y el programa te dice: "Hardware virtualization is disabled in BIOS". Esta instrucción reside en el silicio de la CPU pero debe habilitarse en el firmware.',
      mythVsTruth: {
        mentira: '“La virtualización se activa instalando un programa en Windows.”',
        verdad: 'La virtualización por hardware (Intel VT-x / AMD-V / SVM) es una capacidad del procesador que el firmware de la placa madre puede bloquear o habilitar.',
        comprobalo: 'Revisá en el Administrador de Tareas > Rendimiento > CPU si "Virtualización" dice "Habilitado".',
      },
    },
    entende: {
      title: 'Por qué Existe en Firmware',
      explanation: [
        '• Intel VT-x / AMD SVM: Extensiones de instrucciones que permiten al procesador ejecutar múltiples sistemas operativos con acceso directo y seguro a los registros del silicio.',
        '• SLAT (Second Level Address Translation): Traducción rápida de tablas de páginas de memoria virtual.',
      ],
    },
    profundiza: {
      title: 'Seguridad Basada en Virtualización (VBS / Core Isolation)',
      technicalDetails: [
        'Windows 11 utiliza la virtualización de hardware no solo para máquinas virtuales, sino para aislar su propio subsistema de seguridad (VBS / HVCI) en un enclave protegido contra malware de kernel.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar Virtualización en el Administrador de Tareas',
      steps: [
        '1. Abrí el Administrador de Tareas (Ctrl + Shift + Esc).',
        '2. Pestaña Rendimiento > CPU.',
        '3. Abajo a la derecha, leé: “Virtualización: Habilitado”.',
      ],
      shortcut: 'Ctrl + Shift + Esc → Rendimiento → CPU',
      expectedVisual: 'Campo Virtualización: Habilitado.',
    },
    comprobalo: {
      instruction: 'Verificá el estado de la virtualización en tu procesador.',
      actionPrompt: 'Registrá el estado de VT-x / AMD-V en el mapa.',
      validationKey: 'VIRTUALIZATION_STATUS_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un desarrollador intenta iniciar WSL2 en Windows 11 y recibe el error: "Please enable Virtualization in BIOS/firmware". ¿Dónde debe realizarse el cambio?',
      instruction: 'Identificá la ubicación del ajuste:',
      options: [
        { id: 'vtx1', text: 'Reiniciar la PC, entrar al menú de la UEFI y habilitar Intel Virtualization Technology (VT-x) o AMD SVM Mode.', isCorrect: true, feedback: '¡Correcto! El interruptor maestro de virtualización reside en el firmware.' },
        { id: 'vtx2', text: 'En la papelera de reciclaje.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'CPU_VIRTUALIZATION_ENABLED',
      targetDescription: 'Estado de virtualización por hardware (VT-x / AMD-V)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-12',
    code: '01.12',
    title: 'IOMMU: CONTROL Y AISLAMIENTO DE ACCESO DIRECTO A MEMORIA',
    subtitle: 'DMA Remapping y la protección contra ataques por puertos externos',
    descubri: {
      hook: 'Si conectás un dispositivo Thunderbolt o PCIe malicioso, este podría intentar leer toda tu memoria RAM directamente saltándose el sistema operativo (Ataque DMA). IOMMU existe para evitarlo.',
      mythVsTruth: {
        mentira: '“Cualquier tarjeta PCIe puede leer cualquier dirección de memoria RAM sin restricciones.”',
        verdad: 'IOMMU (Intel VT-d / AMD-Vi) actúa como una tabla de traducción y cortafuegos entre los dispositivos PCIe y la memoria física del sistema.',
        comprobalo: 'Revisá en Seguridad del Dispositivo si "Protección contra DMA de kernel" está activa.',
      },
    },
    entende: {
      title: 'El Rol de IOMMU',
      explanation: [
        '• DMA (Direct Memory Access): Capacidad de tarjetas gráficas, controladoras y adaptadores de red de escribir en RAM sin saturar la CPU.',
        '• IOMMU (Input-Output Memory Management Unit): Traduce direcciones virtuales de dispositivos y aísla qué rangos de memoria puede tocar cada tarjeta.',
      ],
    },
    profundiza: {
      title: 'Passthrough en Virtualización',
      technicalDetails: [
        'IOMMU es la tecnología que permite asignar una tarjeta gráfica física entera de forma exclusiva a una máquina virtual con rendimiento nativo.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar Kernel DMA Protection en msinfo32',
      steps: [
        '1. Abrí `msinfo32`.',
        '2. Buscá el campo “Protección contra DMA de kernel”.',
      ],
      commandOrPath: 'msinfo32',
      expectedVisual: 'Campo indicando "Activado" o "Desactivado".',
    },
    comprobalo: {
      instruction: 'Confirmá si tu equipo cuenta con protección IOMMU / DMA de kernel activa.',
      actionPrompt: 'Registrá el estado de DMA Protection en tu expediente.',
      validationKey: 'IOMMU_DMA_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué peligro previene la tecnología IOMMU / Kernel DMA Protection?',
      instruction: 'Identificá el vector de ataque mitigado:',
      options: [
        { id: 'io1', text: 'Dispositivos maliciosos conectados por Thunderbolt o PCIe que intentan leer claves y memoria en texto plano mediante DMA.', isCorrect: true, feedback: '¡Brillante! IOMMU encapsula el acceso a memoria de los buses externos.' },
        { id: 'io2', text: 'Que se corte la luz en la casa.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'KERNEL_DMA_PROTECTION',
      targetDescription: 'Protección contra DMA de kernel vía IOMMU',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-13',
    code: '01.13',
    title: 'XMP / EXPO: ESTO NO ES WINDOWS, PERO WINDOWS SUFRE EL RESULTADO',
    subtitle: 'Los perfiles de memoria de alto rendimiento y la estabilidad del sistema',
    descubri: {
      hook: 'Comprás una memoria RAM que en la caja dice "DDR5 6000 MHz". La instalás, abrís Windows y el Administrador de Tareas dice "4800 MHz". ¿Te estafaron? No: la RAM arranca por seguridad a velocidad base JEDEC hasta que activás el perfil XMP/EXPO en el firmware.',
      mythVsTruth: {
        mentira: '“La memoria RAM siempre funciona a la velocidad máxima impresa en la caja automáticamente.”',
        verdad: 'Toda memoria inicia a la frecuencia estándar JEDEC. Los perfiles XMP (Intel) o EXPO (AMD) son perfiles de overclocking de fábrica que deben activarse en la UEFI.',
        comprobalo: 'Compará la frecuencia base con la frecuencia activa en Administrador de Tareas > Rendimiento > Memoria.',
      },
    },
    entende: {
      title: 'JEDEC vs XMP/EXPO',
      explanation: [
        '• JEDEC: Estándar universal de compatibilidad y estabilidad absoluta garantizada (ej. DDR4-2133/2400/3200 o DDR5-4800/5200).',
        '• XMP / EXPO: Perfil pregrabado por el fabricante con voltajes y latencias ajustadas para alcanzar mayores frecuencias.',
      ],
    },
    profundiza: {
      title: 'Inestabilidad y Pantallazos Azules (BSOD)',
      technicalDetails: [
        'Si el controlador de memoria integrado (IMC) de tu procesador no soporta la frecuencia del perfil XMP, Windows sufrirá cuelgues aleatorios (`MEMORY_MANAGEMENT`, `CRITICAL_PROCESS_DIED`).',
        'El usuario suele culpar a Windows, cuando la causa raíz es una inestabilidad física de la memoria configurada en firmware.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Verificar la velocidad de RAM en Windows',
      steps: [
        '1. Abrí el Administrador de Tareas > Rendimiento > Memoria.',
        '2. Leé abajo a la derecha: “Velocidad” (ej. 3200 MT/s o 6000 MT/s).',
      ],
      shortcut: 'Ctrl + Shift + Esc → Memoria',
      expectedVisual: 'Velocidad efectiva de transferencia de memoria.',
    },
    comprobalo: {
      instruction: 'Anotá la velocidad de memoria RAM reportada por el sistema.',
      actionPrompt: 'Registrá la velocidad de RAM en el expediente.',
      validationKey: 'RAM_SPEED_RECORDED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Una PC sufre pantallazos azules aleatorios al jugar tras activar un perfil XMP de 7200 MHz en un procesador cuyo controlador de memoria solo tolera hasta 6400 MHz de forma estable. ¿Cuál es el procedimiento técnico correcto?',
      instruction: 'Elegí el descarte metódico:',
      options: [
        { id: 'x1', text: 'Entrar a la UEFI, desactivar XMP o ajustar la frecuencia manualmente a 6000/6400 MHz y probar estabilidad antes de tocar Windows.', isCorrect: true, feedback: '¡Exacto! La estabilidad del silicio en firmware debe asegurarse antes de culpar al SO.' },
        { id: 'x2', text: 'Formatear Windows 3 veces.', isCorrect: false, feedback: 'Incorrecto: La inestabilidad física persistirá.' },
      ],
    },
    evidencia: {
      fieldName: 'RAM_SPEED_MTS',
      targetDescription: 'Velocidad de transferencia de memoria RAM configurada',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-14',
    code: '01.14',
    title: 'RESIZABLE BAR: MAPEO DIRECTO DE MEMORIA GPU',
    subtitle: 'Cómo la CPU accede a toda la VRAM de un solo golpe',
    descubri: {
      hook: 'Históricamente, la CPU solo podía acceder a la memoria de la tarjeta gráfica en bloques diminutos de 256 MB. Resizable BAR (ReBAR / Smart Access Memory) elimina ese cuello de botella permitiendo a la CPU ver todos los Gigabytes de VRAM simultáneamente.',
      mythVsTruth: {
        mentira: '“Resizable BAR es un truco de software de los drivers de la tarjeta de video.”',
        verdad: 'Resizable BAR es una capacidad de la especificación PCIe que exige soporte y activación en el firmware UEFI (Above 4G Decoding).',
        comprobalo: 'Revisá en el Panel de Control de NVIDIA o AMD si "Resizable BAR" figura como "Sí".',
      },
    },
    entende: {
      title: 'Requisitos de la Cadena',
      explanation: [
        '1. Placa madre con UEFI nativa y CSM desactivado.',
        '2. Opción "Above 4G Decoding" y "Re-Size BAR Support" habilitadas en el firmware.',
        '3. Disco en formato GPT.',
        '4. Procesador y tarjeta gráfica compatibles.',
      ],
    },
    profundiza: {
      title: 'Impacto en Rendimiento',
      technicalDetails: [
        'Al transferir texturas y shaders pesados, la CPU no tiene que dividir las solicitudes en cientos de llamadas pequeñas de 256 MB, reduciendo la latencia de renderizado de cuadros.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar Resizable BAR en el Panel de GPU',
      steps: [
        '1. Abrí el Panel de Control de NVIDIA > Ayuda > Información del sistema.',
        '2. Buscá en la lista de detalles: “Resizable BAR: Sí / No”.',
      ],
      expectedVisual: 'Indicador de estado de Resizable BAR.',
    },
    comprobalo: {
      instruction: 'Comprobá si tu equipo cuenta con Resizable BAR activo.',
      actionPrompt: 'Registrá el estado de ReBAR en el mapa.',
      validationKey: 'REBAR_STATUS_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué Resizable BAR no puede activarse si el firmware tiene activado el modo Legacy / CSM?',
      instruction: 'Identificá la incompatibilidad de direccionamiento:',
      options: [
        { id: 'rb1', text: 'Porque el modo Legacy de 16/32 bits no soporta direccionamiento de memoria de 64 bits por encima de los 4 GB (Above 4G Decoding).', isCorrect: true, feedback: '¡Correcto! ReBAR exige direccionamiento de 64 bits puro en UEFI.' },
        { id: 'rb2', text: 'Porque el cable de la pantalla no tiene suficiente corriente.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'RESIZABLE_BAR_STATE',
      targetDescription: 'Estado de soporte y activación de Resizable BAR',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-15',
    code: '01.15',
    title: 'VENTILADORES Y FIRMWARE: REGLAS INDEPENDIENTES',
    subtitle: 'Por qué la curva térmica del firmware manda sobre el software de Windows',
    descubri: {
      hook: 'Windows puede colgarse por completo con un pantallazo azul, pero si tu CPU se calienta a 90°C, los ventiladores acelerarán al máximo inmediatamente. ¿Por qué? Porque el control térmico de emergencia vive en el firmware, no en Windows.',
      mythVsTruth: {
        mentira: '“Si Windows se cuelga, los ventiladores se apagan y el procesador se quema.”',
        verdad: 'El controlador embebido (EC / Super I/O) y el firmware gestionan las curvas térmicas por hardware de forma totalmente autónoma.',
        comprobalo: 'Entrá a la UEFI: verás que podés configurar curvas de ventilación PWM sin ningún software instalado.',
      },
    },
    entende: {
      title: 'Control por Hardware vs Control por Software',
      explanation: [
        '• Firmware (BIOS Fan Curves / Q-Fan / Smart Fan): Reglas grabadas en la placa madre que operan desde el segundo 0 del encendido.',
        '• Software de Windows (apps de fabricantes): Aplicaciones en espacio de usuario que pueden sobreescribir las curvas mientras Windows esté corriendo.',
      ],
    },
    profundiza: {
      title: 'Thermal Throttling y Apagado Crítico (Tjunction Max)',
      technicalDetails: [
        'Si la temperatura de la CPU alcanza el límite de diseño térmico (TjMax ~100°C), los transistores del procesador bajan la frecuencia automáticamente (Throttling).',
        'Si supera los 105°C, el circuito térmico de la placa madre corta la alimentación inmediatamente (THERMTRIP#) para evitar daños físicos.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar curvas de ventilación en UEFI',
      steps: [
        '1. Al encender la PC, ingresá al menú de la placa madre.',
        '2. Buscá la sección "Hardware Monitor" o "Fan Control".',
        '3. Observá las fuentes de temperatura (CPU Package / VRM / System).',
      ],
      expectedVisual: 'Gráfico interactivo de temperatura vs porcentaje de revoluciones (RPM / PWM).',
    },
    comprobalo: {
      instruction: 'Comprendé que la refrigeración de base está garantizada por hardware antes de cargar Windows.',
      actionPrompt: 'Registrá la autonomía del firmware térmico en tu expediente.',
      validationKey: 'THERMAL_FIRMWARE_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué componente ejecuta el apagado de emergencia si un disipador se desprende de la CPU mientras Windows está congelado?',
      instruction: 'Identificá el mecanismo de protección:',
      options: [
        { id: 'fan1', text: 'Los sensores internos de la CPU y el circuito de protección térmica de la placa madre cortan la energía por hardware (THERMTRIP#).', isCorrect: true, feedback: '¡Exacto! La protección física del silicio no depende de que el SO responda.' },
        { id: 'fan2', text: 'El antivirus de Windows.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'FIRMWARE_FAN_AUTONOMY',
      targetDescription: 'Comprensión de la autonomía del control térmico por hardware',
      defaultProvenance: 'DERIVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-16',
    code: '01.16',
    title: 'TRUCO OCULTO: ENTRAR AL FIRMWARE SIN ADIVINAR F2/DEL',
    subtitle: 'El reinicio avanzado de Windows hacia la configuración UEFI',
    descubri: {
      hook: 'Tenés un monitor moderno o un teclado inalámbrico que no responde a tiempo durante el encendido y te volvés loco apretando F2 o Supr sin lograr entrar a la BIOS. Hay una forma 100% oficial de entrar desde Windows con un solo clic.',
      mythVsTruth: {
        mentira: '“La única forma de entrar a la BIOS es adivinar la tecla rápida y apretarla 50 veces por segundo.”',
        verdad: 'Windows tiene una API para instruir al firmware que en el próximo reinicio abra directamente el menú de configuración UEFI.',
        comprobalo: 'Mantené presionada la tecla Shift mientras hacés clic en "Reiniciar" en el menú Inicio.',
      },
    },
    entende: {
      title: 'La Ruta Gráfica Oficial',
      explanation: [
        '1. Presioná Win + I (Configuración) > Sistema > Recuperación.',
        '2. En "Inicio avanzado", hacé clic en "Reiniciar ahora".',
        '3. En el menú azul: Solucionar problemas > Opciones avanzadas > Configuración de firmware UEFI.',
        '4. Al reiniciar, la placa madre abrirá el menú de la BIOS automáticamente.',
      ],
    },
    profundiza: {
      title: 'Por qué no todas las teclas son iguales',
      technicalDetails: [
        'ASUS / MSI / Gigabyte suelen usar `Del` o `F2`.',
        'HP suele usar `F10` o `Esc`.',
        'Lenovo suele usar `F2` o el botón Novo.',
        'Dell suele usar `F2` (BIOS) o `F12` (Boot Menu).',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Lanzar el menú de Recuperación con Shift + Reiniciar',
      steps: [
        '1. Abrí el menú Inicio.',
        '2. Mantené apretada la tecla Shift y hacé clic en el botón de Encendido > "Reiniciar".',
        '3. Observá cómo Windows entra al entorno WinRE con opciones avanzadas.',
      ],
      shortcut: 'Shift + Clic en Reiniciar',
      expectedVisual: 'Menú azul de opciones avanzadas de arranque.',
    },
    comprobalo: {
      instruction: 'Conocé la ruta de reinicio avanzado hacia UEFI.',
      actionPrompt: 'Verificá el procedimiento de acceso sin tecla en tu expediente.',
      validationKey: 'UEFI_ACCESS_METHOD_VERIFIED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Un monitor ultrawide tarda 10 segundos en dar señal y no te permite ver la pantalla de POST para presionar Supr. ¿Cómo entrás a la UEFI de forma garantizada?',
      instruction: 'Elegí el método pericial:',
      options: [
        { id: 'ac1', text: 'Usar Configuración > Sistema > Recuperación > Inicio avanzado > Configuración de firmware UEFI (o Shift + Reiniciar).', isCorrect: true, feedback: '¡Impecable! Windows programa la variable NVRAM `OsIndications` para entrar directo.' },
        { id: 'ac2', text: 'Desarmar el gabinete y sacar la pila.', isCorrect: false, feedback: 'Acción innecesaria y destructiva de configuraciones.' },
      ],
    },
    evidencia: {
      fieldName: 'UEFI_ADVANCED_REBOOT_AWARENESS',
      targetDescription: 'Dominio del método de reinicio hacia firmware UEFI sin adivinar teclas',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-17',
    code: '01.17',
    title: 'ENTRAR A UEFI DIRECTAMENTE POR COMANDO',
    subtitle: 'El modificador /fw del comando shutdown en Windows',
    descubri: {
      hook: '¿Querés reiniciar directamente a la BIOS desde un script o terminal sin pasar por 5 menús gráficos? Windows incluye el modificador `/fw` en el comando nativo `shutdown`.',
      mythVsTruth: {
        mentira: '“No existe ningún comando de consola que pueda comunicarse con el firmware de la placa.”',
        verdad: 'El comando `shutdown /r /fw /t 0` escribe en la variable NVRAM del firmware la solicitud de entrar a la interfaz de configuración.',
        comprobalo: 'Abrí CMD como Administrador y escribí `shutdown /?` para leer la descripción oficial del parámetro `/fw`.',
      },
    },
    entende: {
      title: 'Anatomía del Comando',
      explanation: [
        '• `shutdown`: El ejecutable de control de energía del sistema.',
        '• `/r`: Indica reiniciar la máquina.',
        '• `/fw`: Instruye al firmware UEFI a abrir la interfaz de configuración en el arranque.',
        '• `/t 0`: Tiempo de espera de 0 segundos (ejecución inmediata).',
      ],
    },
    profundiza: {
      title: 'Requisitos de Compatibilidad',
      technicalDetails: [
        'Requiere que Windows esté corriendo en modo UEFI nativo con privilegios administrativos.',
        'Si el equipo está en modo BIOS Heredado (Legacy/CSM), el comando devolverá el error: "La interfaz de firmware del sistema no admite la opción de firmware."',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Consultar la ayuda del comando shutdown',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `shutdown /?` y buscá la línea correspondiente a `/fw`.',
      ],
      commandOrPath: 'shutdown /?',
      expectedVisual: '`  /fw      Combina con una opción de apagado para que el siguiente arranque vaya a la interfaz de usuario de firmware.`',
    },
    comprobalo: {
      instruction: 'Anotá el comando exacto para reiniciar a UEFI desde la terminal.',
      actionPrompt: 'Registrá el comando en tu caja de herramientas.',
      validationKey: 'SHUTDOWN_FW_COMMAND_LEARNED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Ejecutás `shutdown /r /fw /t 0` en una PC antigua y recibís un mensaje de error que dice que la opción no es compatible. ¿Por qué ocurre esto?',
      instruction: 'Identificá la causa técnica:',
      options: [
        { id: 'fw1', text: 'Porque la PC está en modo BIOS Legacy / MBR y las BIOS clásicas no soportan la variable NVRAM de reinicio a firmware de UEFI.', isCorrect: true, feedback: '¡Exacto! El modificador /fw requiere obligatoriamente arquitectura UEFI nativa.' },
        { id: 'fw2', text: 'Porque el teclado no es USB.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SHUTDOWN_FW_TOOL',
      targetDescription: 'Comando `shutdown /r /fw /t 0` para acceso directo a UEFI',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-18',
    code: '01.18',
    title: 'LA MISTERIOSA PARTICIÓN EFI (ESP)',
    subtitle: '☠ ZONA ROJA: La partición de 100 MB que nunca ves en Este equipo',
    descubri: {
      hook: 'Abrís "Este equipo" y solo ves el disco C:. Pero si abrís el Administrador de Discos, descubrís una partición oculta de 100 MB formateada en FAT32 llamada "Partición del sistema EFI". Si la borrás, tu Windows nunca más volverá a encender.',
      mythVsTruth: {
        mentira: '“Esa partición de 100 MB es basura que dejó el fabricante y puedo borrarla para ganar espacio.”',
        verdad: 'La Partición del Sistema EFI (ESP) contiene los archivos de arranque universales que la placa madre necesita para despertar a Windows.',
        comprobalo: 'Inspeccioná tu disco en `diskmgmt.msc`: verás que no tiene letra asignada para protegerla de modificaciones accidentales.',
      },
    },
    entende: {
      title: 'Estructura de la Partición ESP',
      explanation: [
        '• Formato: FAT32 obligatorio según el estándar UEFI.',
        '• Tamaño típico: 100 MB a 260 MB.',
        '• Ruta principal: `\\EFI\\Microsoft\\Boot\\`.',
        '• Archivos clave: `bootmgfw.efi` (Boot Manager), `BCD` (Base de datos de arranque), fuentes tipográficas de arranque y memtest.',
      ],
    },
    profundiza: {
      title: 'Por qué Windows no le asigna letra de unidad',
      technicalDetails: [
        'Para evitar que programas de usuario, virus o clics accidentales borren los binarios de arranque, Windows oculta la partición ESP del Explorador.',
        'Para inspeccionarla en laboratorio forense, se requiere usar `mountvol S: /s` desde una consola de Administrador.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Observar la partición EFI en el Administrador de Discos',
      steps: [
        '1. Presioná Win + X y seleccioná “Administración de discos”.',
        '2. En Disco 0, ubicá la partición de ~100 MB con el rótulo “Partición del sistema EFI”.',
      ],
      commandOrPath: 'diskmgmt.msc',
      expectedVisual: 'Bloque de partición EFI protegido en el disco de arranque.',
    },
    comprobalo: {
      instruction: 'Confirmá el tamaño y la existencia de tu partición del sistema EFI.',
      actionPrompt: 'Registrá la partición ESP en el mapa de disco.',
      validationKey: 'EFI_PARTITION_IDENTIFIED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Un usuario ejecutó un script de "limpieza profunda" que eliminó la partición FAT32 de 100 MB del disco. Al reiniciar, la PC dice: "NO BOOTABLE DEVICE FOUND". ¿Qué ocurrió técnicamente?',
      instruction: 'Identificá la causa raíz:',
      options: [
        { id: 'esp1', text: 'Se eliminó la partición ESP que contenía `bootmgfw.efi` y el BCD. El firmware no encuentra el cargador de arranque.', isCorrect: true, feedback: '¡Exacto! El sistema operativo sigue intacto en C:, pero no hay puente de arranque.' },
        { id: 'esp2', text: 'Se quemó la memoria RAM.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'EFI_SYSTEM_PARTITION_HEALTH',
      targetDescription: 'Existencia e integridad de la partición del sistema EFI (ESP)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-19',
    code: '01.19',
    title: 'WINDOWS BOOT MANAGER',
    subtitle: 'El gestor de arranque oficial: el puente entre la placa y el sistema operativo',
    descubri: {
      hook: 'La UEFI ya encontró el disco y ejecutó `bootmgfw.efi`. Ahora entra en acción el Windows Boot Manager. Su misión es leer la configuración de arranque, verificar la firma digital del núcleo y preparar el terreno para cargar Windows.',
      mythVsTruth: {
        mentira: '“El Windows Boot Manager es el kernel de Windows.”',
        verdad: 'El Boot Manager es una aplicación EFI ligera cuyo único propósito es localizar, configurar y lanzar el cargador del kernel (`winload.efi`).',
        comprobalo: 'Si tenés dos versiones de Windows instaladas (Dual Boot), el Boot Manager es quien te muestra el menú azul de selección.',
      },
    },
    entende: {
      title: 'El Árbol de Ejecución',
      explanation: [
        '1. UEFI transfiere el control a `bootmgfw.efi`.',
        '2. Windows Boot Manager lee el archivo `BCD` de la partición EFI.',
        '3. Si hay un solo sistema, procede de inmediato. Si hay varios o se presionó F8, muestra el menú de selección.',
        '4. Ejecuta `\\Windows\\system32\\winload.efi` en la partición de Windows (C:).',
      ],
    },
    profundiza: {
      title: 'Criptografía y BitLocker',
      technicalDetails: [
        'Si el disco C: está cifrado con BitLocker, el Windows Boot Manager se comunica con el chip TPM para obtener la clave de volumen (VMK) y desbloquear la partición antes de poder leer `winload.efi`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar el identificador {bootmgr}',
      steps: [
        '1. Abrí CMD como Administrador.',
        '2. Escribí `bcdedit /enum {bootmgr}` y leé los campos `device` y `path`.',
      ],
      commandOrPath: 'bcdedit /enum {bootmgr}',
      expectedVisual: 'Reporte del Administrador de arranque de Windows.',
    },
    comprobalo: {
      instruction: 'Revisá la configuración del Administrador de arranque en tu terminal.',
      actionPrompt: 'Registrá el estado del Boot Manager en el expediente.',
      validationKey: 'BOOTMGR_OBJECT_RECORDED',
    },
    microdesafio: {
      type: 'STAGE_ISOLATION',
      question: '¿Qué archivo consulta el Windows Boot Manager para saber en qué disco y partición se encuentra instalado el sistema operativo?',
      instruction: 'Identificá la base de datos de arranque:',
      options: [
        { id: 'bm1', text: 'El archivo BCD (Boot Configuration Data).', isCorrect: true, feedback: '¡Correcto! El BCD es el mapa de instrucciones del Boot Manager.' },
        { id: 'bm2', text: 'Un archivo de Word en el Escritorio.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'bm3', text: 'El historial de Edge.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINDOWS_BOOT_MANAGER_OBJECT',
      targetDescription: 'Identificador y configuración del objeto {bootmgr} en BCD',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-20',
    code: '01.20',
    title: 'BCD: EL LIBRO DE INSTRUCCIONES DEL ARRANQUE',
    subtitle: '☠ ZONA ROJA: La base de datos binaria Boot Configuration Data',
    descubri: {
      hook: 'En los tiempos de Windows XP existía un archivo de texto llamado `boot.ini`. En los sistemas modernos existe el BCD: una base de datos binaria estructurada como una colmena del Registro que guarda todos los parámetros de arranque.',
      mythVsTruth: {
        mentira: '“Puedo editar el arranque de Windows abriendo un archivo de texto en el Bloc de Notas.”',
        verdad: 'El BCD es una colmena binaria del Registro que solo debe manipularse mediante herramientas oficiales como `bcdedit.exe` o `msconfig`.',
        comprobalo: 'Escribí `bcdedit /enum` en una consola de Administrador para ver las entradas activas.',
      },
    },
    entende: {
      title: 'Parámetros Cruciales en el BCD',
      explanation: [
        '• `device`: La partición física donde reside el sistema operativo (ej. `partition=C:`).',
        '• `osdevice`: La partición de archivos del sistema.',
        '• `path`: La ruta del cargador (ej. `\\Windows\\system32\\winload.efi`).',
        '• `hypervisorlaunchtype`: Control de inicio del hipervisor para virtualización y seguridad VBS.',
        '• `safeboot`: Parámetro para forzar el Modo Seguro.',
      ],
    },
    profundiza: {
      title: 'El Peligro de Modificar el BCD a Ciegas',
      technicalDetails: [
        'Un error tipográfico en el comando `bcdedit` (como alterar el `osdevice`) provocará el error de arranque `0xc000000e` o `0xc0000034` (The Boot Configuration Data file is missing or contains errors).',
        'Para repararlo se requiere iniciar desde un medio de instalación y ejecutar `bootrec /rebuildbcd`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar el BCD en modo solo lectura',
      steps: [
        '1. Abrí CMD como Administrador.',
        '2. Escribí: `bcdedit /enum` y presioná Enter.',
        '3. Observá las dos secciones: "Administrador de arranque de Windows" ({bootmgr}) y "Cargador de arranque de Windows" ({current}).',
      ],
      commandOrPath: 'bcdedit /enum',
      expectedVisual: 'Listado completo de objetos y descriptores de arranque.',
    },
    comprobalo: {
      instruction: 'Verificá que el cargador `{current}` apunte correctamente a `winload.efi`.',
      actionPrompt: 'Registrá los parámetros del BCD en tu expediente.',
      validationKey: 'BCD_ENUM_VERIFIED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Al encender la PC aparece una pantalla azul de recuperación con el código de error `0xc000000e: The Boot Configuration Data for your PC is missing or contains errors`. ¿En qué componente está la falla?',
      instruction: 'Localizá el elemento corrupto:',
      options: [
        { id: 'bcd1', text: 'En la base de datos BCD dentro de la partición EFI, cuyas entradas de disco o punteros están dañados.', isCorrect: true, feedback: '¡Exacto! El código 0xc000000e indica fallo en la lectura del BCD.' },
        { id: 'bcd2', text: 'En el monitor que perdió señal HDMI.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'BCD_CONFIGURATION_INTEGRITY',
      targetDescription: 'Integridad y lectura de las entradas del almacén BCD',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-21',
    code: '01.21',
    title: 'WINLOAD.EFI: EL INSTANTE EN QUE WINDOWS DESPIERTA',
    subtitle: 'El cargador del sistema operativo que prepara la memoria y las tablas de páginas',
    descubri: {
      hook: 'Hasta este instante todo corría bajo las APIs simples del firmware. Cuando el Boot Manager ejecuta `winload.efi`, comienza la magia: se inicializa la arquitectura de memoria virtual de 64 bits y se leen los primeros controladores del disco.',
      mythVsTruth: {
        mentira: '“winload.efi es el kernel de Windows.”',
        verdad: 'winload.efi es el loader previo al kernel. Carga el núcleo `ntoskrnl.exe`, la capa de abstracción HAL y los controladores marcados como BOOT_START en la memoria RAM.',
        comprobalo: 'winload.efi reside en `C:\\Windows\\System32\\winload.efi` con firma digital de Microsoft.',
      },
    },
    entende: {
      title: 'Las Funciones de winload.efi',
      explanation: [
        '1. Inicializa las estructuras de paginación de memoria de 64 bits (PML4 / PML5).',
        '2. Carga en memoria el archivo del núcleo (`ntoskrnl.exe`) y la librería HAL (`hal.dll`).',
        '3. Carga la colmena del Registro del sistema (`SYSTEM`) desde `C:\\Windows\\System32\\config\\SYSTEM`.',
        '4. Escanea la colmena para identificar qué controladores tienen el valor `Start = 0` (Boot Start).',
        '5. Transfiere el control de la CPU al núcleo.',
      ],
    },
    profundiza: {
      title: 'El momento del "ExitBootServices"',
      technicalDetails: [
        'Justo antes de pasar el control al Kernel, winload ejecuta la llamada `ExitBootServices()`.',
        'En ese microsegundo exacto, la UEFI se desactiva y el control total de la memoria y el hardware pasa a ser propiedad exclusiva de Windows.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la existencia de winload.efi',
      steps: [
        '1. Abrí CMD y escribí: `dir C:\\Windows\\System32\\winload.efi`',
      ],
      commandOrPath: 'dir C:\\Windows\\System32\\winload.efi',
      expectedVisual: 'Archivo ejecutable EFI de ~2 MB en System32.',
    },
    comprobalo: {
      instruction: 'Confirmá el rol de winload.efi como puente de carga hacia el núcleo.',
      actionPrompt: 'Registrá la función de winload en tu mapa de arranque.',
      validationKey: 'WINLOAD_ROLE_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué llamada crucial ejecuta winload.efi para indicarle a la placa madre que el firmware debe terminar y que Windows toma el control de la memoria?',
      instruction: 'Identificá la llamada de transición:',
      options: [
        { id: 'wl1', text: 'ExitBootServices() — La llamada estándar de UEFI que libera los servicios de arranque del firmware.', isCorrect: true, feedback: '¡Brillante! ExitBootServices marca el límite exacto donde termina la UEFI y nace Windows.' },
        { id: 'wl2', text: 'CloseWindows()', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINLOAD_TRANSITION_STAGE',
      targetDescription: 'Transición de ExitBootServices ejecutada por winload.efi',
      defaultProvenance: 'DERIVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-22',
    code: '01.22',
    title: 'EL KERNEL ENTRA EN ESCENA (NTOSKRNL.EXE)',
    subtitle: 'El nacimiento de los subsistemas y la fase 0 de inicialización del núcleo',
    descubri: {
      hook: '¡Aparece el círculo giratorio de puntos en pantalla! Ese círculo significa una sola cosa: `ntoskrnl.exe` tomó el control del procesador. El núcleo de Windows NT acaba de nacer.',
      mythVsTruth: {
        mentira: '“El círculo de puntos girando significa que Windows está buscando virus.”',
        verdad: 'El círculo giratorio indica que el Kernel NT está inicializando sus subsistemas: gestión de memoria, programación de hilos, seguridad y controladores de hardware.',
        comprobalo: 'ntoskrnl.exe es el binario maestro ubicado en `C:\\Windows\\System32\\ntoskrnl.exe`.',
      },
    },
    entende: {
      title: 'Fase 0 y Fase 1 del Kernel',
      explanation: [
        '• Fase 0 (Interrupciones Desactivadas): Se inicializa la tabla de interrupciones, el gestor de memoria física y las estructuras básicas de CPU.',
        '• Fase 1 (Interrupciones Activadas): Se inicializan los hilos de trabajo, el subsistema de entrada/salida (I/O Manager), el subsistema de energía (ACPI) y se montan los volúmenes de disco.',
      ],
    },
    profundiza: {
      title: 'TEASER SECTOR 32: Ring 0 y la Capa HAL',
      technicalDetails: [
        '`hal.dll` (Hardware Abstraction Layer) traduce las peculiaridades de cada placa madre para que el núcleo `ntoskrnl.exe` pueda ser idéntico en millones de computadoras diferentes.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar ntoskrnl.exe en System32',
      steps: [
        '1. Abrí el Explorador de Archivos y andá a `C:\\Windows\\System32`.',
        '2. Hacé clic derecho en `ntoskrnl.exe` > Propiedades > Pestaña "Detalles".',
        '3. Leé la descripción: "Archivo del sistema ejecutable del kernel NT".',
      ],
      expectedVisual: 'Ficha de propiedades de ntoskrnl.exe.',
    },
    comprobalo: {
      instruction: 'Comprendé el momento exacto en que el Kernel NT asume el control del procesador.',
      actionPrompt: 'Registrá la fase de inicialización de ntoskrnl.exe en tu expediente.',
      validationKey: 'KERNEL_INIT_STAGE_RECORDED',
    },
    microdesafio: {
      type: 'STAGE_ISOLATION',
      question: '¿Qué binario representa el núcleo central del sistema operativo Windows NT?',
      instruction: 'Identificá el archivo del kernel:',
      options: [
        { id: 'k1', text: 'ntoskrnl.exe (NT Operating System Kernel)', isCorrect: true, feedback: '¡Correcto! Es el corazón de todo el sistema operativo Windows.' },
        { id: 'k2', text: 'calc.exe', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'k3', text: 'mspaint.exe', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'KERNEL_NTOSKRNL_PRESENCE',
      targetDescription: 'Identificación del núcleo NT (ntoskrnl.exe) y capa HAL',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-23',
    code: '01.23',
    title: 'BOOT DRIVERS: LOS PRIMEROS EN DESPERTAR',
    subtitle: 'Por qué un fallo en el driver de almacenamiento produce INACCESSIBLE_BOOT_DEVICE',
    descubri: {
      hook: 'Windows tiene miles de controladores. Pero hay un grupo selecto de controladores marcados como `Start = 0` (BOOT_START) que deben cargarse obligatoriamente al inicio. Si el driver de tu NVMe o chipset falla, el kernel no puede leer su propio disco.',
      mythVsTruth: {
        mentira: '“Todos los drivers se cargan al mismo tiempo cuando abre el escritorio.”',
        verdad: 'Los drivers se cargan en 4 fases estrictas: Boot (0), System (1), Auto (2) y Manual (3). Los de fase Boot son indispensables para no colapsar.',
        comprobalo: 'El famoso pantallazo azul `INACCESSIBLE_BOOT_DEVICE` ocurre cuando el kernel no tiene el driver para comunicarse con la controladora de disco.',
      },
    },
    entende: {
      title: 'Los Controladores Esenciales de Boot',
      explanation: [
        '1. Driver de bus de almacenamiento (stornvme.sys / storahci.sys).',
        '2. Driver del sistema de archivos (ntfs.sys).',
        '3. Driver del controlador de interrupciones y energía (acpi.sys).',
        '4. Driver de verificación de firmas de código (ci.dll).',
      ],
    },
    profundiza: {
      title: 'El Error INACCESSIBLE_BOOT_DEVICE (0x0000007B)',
      technicalDetails: [
        'Si cambiaste el modo de almacenamiento en la BIOS de AHCI a RAID/RST sin preparar los drivers de Windows, el kernel se iniciará pero al buscar el disco C: no lo encontrará y lanzará el BSOD 0x7B.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el driver NVMe en el Administrador de Dispositivos',
      steps: [
        '1. Presioná Win + X > Administrador de dispositivos.',
        '2. Desplegá "Controladoras de almacenamiento" > "Controladora estándar NVM Express" > Propiedades > Controlador.',
        '3. Mirá el archivo: `stornvme.sys`.',
      ],
      shortcut: 'Win + X → M',
      expectedVisual: 'Driver stornvme.sys de Microsoft.',
    },
    comprobalo: {
      instruction: 'Reconocé el rol de los Boot Drivers en la prevención de fallos de arranque.',
      actionPrompt: 'Registrá la importancia de los drivers de almacenamiento en el expediente.',
      validationKey: 'BOOT_DRIVERS_RECORDED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Tras cambiar una placa madre sin reinstalar, Windows empieza a cargar pero arroja pantalla azul `INACCESSIBLE_BOOT_DEVICE`. ¿Cuál es la causa técnica más probable?',
      instruction: 'Identificá el conflicto de controladores:',
      options: [
        { id: 'bd1', text: 'El kernel no dispone del controlador de almacenamiento adecuado para inicializar la nueva controladora de disco durante la fase Boot Start.', isCorrect: true, feedback: '¡Exacto! El kernel necesita el driver de la controladora para montar el disco C:.' },
        { id: 'bd2', text: 'El fondo de pantalla no es compatible.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'BOOT_STORAGE_DRIVER_INTEGRITY',
      targetDescription: 'Estado del controlador crítico de almacenamiento (stornvme / storahci)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-24',
    code: '01.24',
    title: 'SERVICES: EL ARRANQUE DE LOS SERVICIOS DE FONDO',
    subtitle: 'El Service Control Manager (services.exe) y el ejército de svchost',
    descubri: {
      hook: 'El kernel ya está activo y montó el disco. Ahora despierta el proceso `smss.exe` (Session Manager), que lanza el subsistema de seguridad (`lsass.exe`) y el Service Control Manager (`services.exe`). Comienza la carga de los servicios de Windows.',
      mythVsTruth: {
        mentira: '“Los servicios de Windows arrancan después de que pongo mi contraseña.”',
        verdad: 'Los servicios del sistema (Audio, Redes, Criptografía, Plug and Play) arrancan en segundo plano en la Sesión 0 mucho antes de que el usuario inicie sesión.',
        comprobalo: 'Podés conectarte por red o acceder a una carpeta compartida de una PC encendida aunque nadie haya iniciado sesión en ella.',
      },
    },
    entende: {
      title: 'El Árbol de Procesos de Sistema',
      explanation: [
        '1. `smss.exe` (Session Manager): Crea las sesiones de Windows.',
        '2. `csrss.exe` (Client/Server Runtime): Maneja hilos y ventanas de consola.',
        '3. `wininit.exe` (Windows Initialization): Lanza los servicios maestros.',
        '4. `services.exe` (Service Control Manager): Inicia los servicios configurados en Inicio Automático.',
        '5. `lsass.exe` (Local Security Authority): Prepara la autenticación.',
      ],
    },
    profundiza: {
      title: 'Aislamiento de Sesión 0 (Session 0 Isolation)',
      technicalDetails: [
        'Desde Windows Vista, todos los servicios de fondo corren aislados en la Sesión 0 sin interfaz gráfica para evitar que aplicaciones maliciosas interactúen con servicios de altos privilegios.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Observar los procesos de sistema en Process Explorer o Task Manager',
      steps: [
        '1. Abrí el Administrador de Tareas > Pestaña "Detalles".',
        '2. Buscá los procesos: `smss.exe`, `csrss.exe`, `wininit.exe`, `services.exe`, `lsass.exe`.',
      ],
      shortcut: 'Ctrl + Shift + Esc → Detalles',
      expectedVisual: 'Lista de ejecutables del sistema corriendo bajo el usuario SYSTEM.',
    },
    comprobalo: {
      instruction: 'Confirmá la presencia de los procesos de sistema de Sesión 0.',
      actionPrompt: 'Registrá la cadena de procesos de sistema en el expediente.',
      validationKey: 'SYSTEM_SERVICES_CHAIN_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué una computadora puede compartir archivos en red y responder a pings antes de que un usuario ingrese su contraseña en pantalla?',
      instruction: 'Explicá el funcionamiento de los servicios:',
      options: [
        { id: 'srv1', text: 'Porque los servicios de red y el servidor SMB se inician automáticamente en Sesión 0 antes del inicio de sesión de usuario.', isCorrect: true, feedback: '¡Correcto! Los servicios del sistema operan de forma independiente al login del usuario.' },
        { id: 'srv2', text: 'Porque Windows adivina la contraseña por adelantado.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SERVICES_MANAGER_CHAIN',
      targetDescription: 'Inicialización del Service Control Manager y procesos de Sesión 0',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-25',
    code: '01.25',
    title: 'LOGON: LA PANTALLA DE INICIO DE SESIÓN',
    subtitle: 'Winlogon, LogonUI, autenticación y carga del perfil de usuario',
    descubri: {
      hook: 'Aparece la fotografía de fondo, el reloj y la casilla de contraseña o PIN. Esta pantalla no es el escritorio: es `LogonUI.exe`, un entorno aislado supervisado por `winlogon.exe` para autenticar tu identidad con seguridad.',
      mythVsTruth: {
        mentira: '“La pantalla de login es una ventana normal del escritorio.”',
        verdad: 'La pantalla de login corre en una sesión de usuario aislada en un escritorio seguro (Winlogon Desktop) para impedir la captura de contraseñas por keyloggers.',
        comprobalo: 'Al presionar Ctrl + Alt + Supr se fuerza la conmutación al escritorio seguro de Windows.',
      },
    },
    entende: {
      title: 'El Protocolo de Autenticación',
      explanation: [
        '1. `winlogon.exe` lanza la interfaz `LogonUI.exe`.',
        '2. El usuario introduce PIN, contraseña o biometría (Windows Hello).',
        '3. `lsass.exe` (Local Security Authority) verifica las credenciales contra la base SAM o tokens de Microsoft Account.',
        '4. Si son válidas, `userinit.exe` monta la colmena del usuario (`NTUSER.DAT`) en `HKEY_CURRENT_USER`.',
        '5. Se lanza el shell del usuario configurado en el Registro (`explorer.exe`).',
      ],
    },
    profundiza: {
      title: 'El Rol de Userinit',
      technicalDetails: [
        '`userinit.exe` ejecuta scripts de inicio de sesión, restaura conexiones de red asignadas y finalmente lanza `explorer.exe`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar la clave de inicio de sesión en el Registro',
      steps: [
        '1. Presioná Win + R, escribí `regedit` y presioná Enter.',
        '2. Navegá a `HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon`.',
        '3. Observá el valor del string `Shell` (debe ser `explorer.exe`) y `Userinit`.',
      ],
      commandOrPath: 'regedit → Winlogon',
      expectedVisual: 'Clave de Registro Winlogon con valor Shell = explorer.exe.',
    },
    comprobalo: {
      instruction: 'Comprendé el flujo de autenticación desde LogonUI hasta el lanzamiento del shell.',
      actionPrompt: 'Registrá el proceso de Logon en tu mapa de arranque.',
      validationKey: 'LOGON_STAGE_VERIFIED',
    },
    microdesafio: {
      type: 'STAGE_ISOLATION',
      question: '¿Qué proceso del sistema operativo se encarga de verificar las contraseñas y emitir los tokens de seguridad del usuario?',
      instruction: 'Identificá el proceso de seguridad:',
      options: [
        { id: 'log1', text: 'lsass.exe (Local Security Authority Subsystem Service)', isCorrect: true, feedback: '¡Correcto! lsass.exe es el árbitro central de autenticación de Windows.' },
        { id: 'log2', text: 'notepad.exe', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'LOGON_AUTHENTICATION_STAGE',
      targetDescription: 'Autenticación en lsass.exe y montaje de NTUSER.DAT por userinit.exe',
      defaultProvenance: 'SYSTEM_REPORTED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-26',
    code: '01.26',
    title: 'EXPLORER SHELL: POR FIN APARECE EL ESCRITORIO',
    subtitle: 'El final del largo viaje de arranque',
    descubri: {
      hook: 'Aparece la barra de tareas, los iconos del escritorio y tus notificaciones. El usuario promedio cree que la computadora recién terminó de encender en este segundo. Un técnico pericial sabe que este es apenas el último paso de una cadena de 13 fases.',
      mythVsTruth: {
        mentira: '“Si la pantalla queda en negro tras poner la contraseña, se rompió todo Windows.”',
        verdad: 'Si ves el cursor del mouse moviéndose sobre fondo negro, el hardware, firmware, kernel y servicios funcionan perfecto: solo falló el lanzamiento de `explorer.exe`.',
        comprobalo: 'Presioná Ctrl + Shift + Esc > Archivo > Ejecutar nueva tarea > `explorer.exe` para recuperar el escritorio de inmediato.',
      },
    },
    entende: {
      title: 'Qué Hace Explorer al Despertar',
      explanation: [
        '1. Inicializa el Desktop Window Manager (DWM) para componer gráficos.',
        '2. Lee la carpeta de Inicio (`%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup`).',
        '3. Carga las claves `Run` del Registro (`HKCU\\...\\Run` y `HKLM\\...\\Run`).',
        '4. Renderiza la barra de tareas, el menú inicio y el área de notificación.',
      ],
    },
    profundiza: {
      title: 'Diferencia entre Fallo de Sistema y Fallo de Shell',
      technicalDetails: [
        'Un aficionado formatea la PC cuando se encuentra con la "pantalla negra con cursor".',
        'Un perito abre el Administrador de Tareas, diagnostica por qué `explorer.exe` se colgó (usualmente una extensión de shell rota) y lo relanza en 10 segundos.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el inicio de explorer.exe',
      steps: [
        '1. Abrí el Administrador de Tareas.',
        '2. En la pestaña Procesos, observá "Explorador de Windows".',
        '3. Su ID de sesión corresponde a tu sesión de usuario interactiva (Sesión 1 o 2).',
      ],
      shortcut: 'Ctrl + Shift + Esc',
      expectedVisual: 'Proceso explorer.exe activo en tu sesión.',
    },
    comprobalo: {
      instruction: 'Confirmá la culminación del ciclo de arranque en el shell de usuario.',
      actionPrompt: 'Registrá la fase final de Explorer en el expediente.',
      validationKey: 'EXPLORER_SHELL_CONFIRMED',
    },
    microdesafio: {
      type: 'DIAGNOSTIC_DECISION',
      question: 'Ingresás tu contraseña, desaparece la pantalla de login y queda una pantalla negra, pero podés mover el cursor del mouse y abrir el Administrador de Tareas con Ctrl+Shift+Esc. ¿Qué diagnóstico corresponde?',
      instruction: 'Seleccioná la causa exacta:',
      options: [
        { id: 'ex1', text: 'El kernel, los drivers y la sesión de usuario están intactos. El fallo está limitado al inicio del shell `explorer.exe`.', isCorrect: true, feedback: '¡Brillante! El cursor activo demuestra que el subsistema gráfico y el kernel funcionan.' },
        { id: 'ex2', text: 'La placa madre está quemada.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'EXPLORER_SHELL_FINAL_STAGE',
      targetDescription: 'Carga completa del shell de usuario explorer.exe y DWM',
      defaultProvenance: 'OBSERVED',
      isBootArtifactField: true,
    },
  },

  {
    id: 'inv-01-27',
    code: '01.27',
    title: 'MAPA DEL DESASTRE: ¿DÓNDE PUEDE ROMPERSE CADA ETAPA?',
    subtitle: 'El árbol de diagnóstico pericial para aislar cualquier falla de encendido',
    descubri: {
      hook: 'Cuando una computadora no arranca, los aficionados adivinan y cambian piezas. Los técnicos profesionales usan el Mapa del Desastre: comparan el síntoma exacto con las 13 fases de arranque para ubicar el punto de ruptura en segundos.',
      mythVsTruth: {
        mentira: '“Cualquier falla que impida ver el escritorio se diagnostica de la misma manera.”',
        verdad: 'Cada etapa de la cadena de arranque produce un síntoma visual y sonoro único y determinista.',
        comprobalo: 'Un fallo en POST da pitidos/LEDs; un fallo en BCD da error 0xc000000e; un fallo en drivers da BSOD; un fallo en Explorer da pantalla negra con cursor.',
      },
    },
    entende: {
      title: 'El Mapa de Síntomas por Fase',
      explanation: [
        '1. POWER: Ventiladores no giran, nada enciende → Falla en fuente / cortocircuito.',
        '2. POST: Ventiladores giran al máximo, pantalla negra sin logo → Falla en CPU / RAM / GPU.',
        '3. UEFI: Entra directo a la BIOS o dice "No boot device" → Disco no detectado o CSM/UEFI mal configurado.',
        '4. EFI / BOOT MGR: Error de BCD / pantalla azul de recuperación → Partición ESP dañada.',
        '5. KERNEL / BOOT DRIVERS: Pantallazo azul girando puntos (INACCESSIBLE_BOOT_DEVICE) → Falla en driver de almacenamiento o kernel.',
        '6. LOGON / EXPLORER: Pantalla negra con cursor móvil → Falla de shell explorer.exe.',
      ],
      diagramLabel: 'MATRIZ FORENSE DE FALLAS',
      diagramItems: [
        { label: 'FASE FÍSICA', desc: 'Sin energía / Sin POST' },
        { label: 'FASE FIRMWARE', desc: 'No boot device / UEFI loop' },
        { label: 'FASE LOADER', desc: 'BCD Error 0xc000000e' },
        { label: 'FASE KERNEL', desc: 'BSOD Inaccessible Boot Device' },
        { label: 'FASE SHELL', desc: 'Black screen with cursor' },
      ],
    },
    profundiza: {
      title: 'La Regla de Oro del Peritaje',
      technicalDetails: [
        'Nunca intentes reparar una fase posterior si las fases anteriores no están comprobadas y estables.',
        'No repares Windows si la PC no supera el POST. No reinstales drivers si el BCD no encuentra el disco.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Consultar el Mapa del Desastre interactivo',
      steps: [
        '1. Abrí el mapa de diagnóstico en el Laboratorio de Arranque.',
        '2. Probá simular las 6 condiciones de fallo.',
      ],
      expectedVisual: 'Matriz completa de diagnóstico de arranque.',
    },
    comprobalo: {
      instruction: 'Completá la consolidación del Mapa del Desastre en tu expediente.',
      actionPrompt: 'Guardá el mapa pericial de diagnóstico en tu artefacto.',
      validationKey: 'DISASTER_MAP_CONSOLIDATED',
    },
    microdesafio: {
      type: 'ORDER_SEQUENCE',
      question: 'Ordená cronológicamente las 6 grandes fases de diagnóstico desde el encendido hasta el escritorio:',
      instruction: 'Colocá las fases en la secuencia exacta:',
      sortableItems: [
        { id: 'f_pwr', text: '1. SEÑAL ELÉCTRICA (PWR_OK / Reset)', correctIndex: 0 },
        { id: 'f_pst', text: '2. POST & INICIALIZACIÓN DE FIRMWARE UEFI', correctIndex: 1 },
        { id: 'f_esp', text: '3. PARTICIÓN EFI & WINDOWS BOOT MANAGER', correctIndex: 2 },
        { id: 'f_krn', text: '4. WINLOAD & CARGA DEL KERNEL NT', correctIndex: 3 },
        { id: 'f_srv', text: '5. SERVICIOS DE SESIÓN 0 & AUTENTICACIÓN LOGON', correctIndex: 4 },
        { id: 'f_exp', text: '6. SHELL EXPLORER.EXE & ESCRITORIO', correctIndex: 5 },
      ],
    },
    evidencia: {
      fieldName: 'DISASTER_MAP_COMPLETED',
      targetDescription: 'Consolidación del mapa forense de diagnóstico de fallas de arranque',
      defaultProvenance: 'DERIVED',
      isBootArtifactField: true,
    },
  },
];
