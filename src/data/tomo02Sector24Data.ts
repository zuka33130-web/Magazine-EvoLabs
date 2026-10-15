// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 24: MÁQUINAS VIRTUALES Y SANDBOX
// "Una computadora dentro de tu computadora"

export type RiskLevelSector24 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector24Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector24;
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

export interface Sector24MiniCase {
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

export interface Sector24TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_24_INVESTIGATIONS: Sector24Investigation[] = [
  {
    id: "inv-24-01",
    code: "24.01",
    title: "Host",
    subtitle: "El sistema operativo anfitrión que administra el hardware físico",
    targetMechanism: "Hardware Physical Resource Manager",
    targetComponent: "Windows Host OS Kernel / Hypervisor Parent Partition",
    commandName: "Get-ComputerInfo | Select-Object CsName, OsName, HyperVisorPresent",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El Host es el dueño directo de la placa madre, procesador, RAM y GPU. Sin embargo, al activar virtualización basada en hipervisor, el propio Host pasa a ejecutarse en la Partición Primaria sobre el hipervisor.",
      mythVsTruth: {
        mentira: "El sistema anfitrión (Host) pierde el 50% de su velocidad simplemente por instalar un hipervisor.",
        verdad: "Los hipervisores modernos de Tipo 1 (como Hyper-V) usan virtualización asistida por hardware (VT-x/AMD-V) con impacto imperceptible para la partición raíz.",
        comprobalo: "Ejecutá 'systeminfo' en CMD y observa la última línea 'Requisitos de Hyper-V'."
      }
    },
    entende: {
      queEs: "La capa principal del sistema operativo que se ejecuta sobre el hardware físico y coordina la distribución de recursos a las máquinas virtuales.",
      paraQueSirve: "Proporciona la interfaz física, controladores de dispositivos reales y almacenamiento para las imágenes virtuales.",
      quePasaSiFalta: "Sin un Host estable, ninguna máquina virtual Guest puede iniciarse o acceder a recursos físicos."
    },
    interactua: {
      cliExample: "systeminfo | findstr /I \"Hyper-V\"",
      psExample: "Get-WmiObject -Class Win32_ComputerSystem | Select-Object HypervisorPresent",
      syntaxBreakdown: "Consulta las propiedades WMI del sistema para confirmar si el procesador está ejecutando un hipervisor en Ring -1.",
      whatToLookFor: "Confirmar 'HypervisorPresent : True'.",
      technicalMetrics: "Latencia adicional por salto de hipervisor: menor a 1-2% en CPU."
    },
    alertaEVO: {
      reversibilityRule: "La característica de Hyper-V se puede activar o desactivar mediante Enable/Disable-WindowsOptionalFeature.",
      safetyWarning: "Modificar la configuración de memoria virtual del Host mientras hay máquinas virtuales activas causará un congelamiento general (Kernel Paging Thrashing)."
    },
    evidenceBadge: {
      code: "VM-HST-01",
      label: "Host Parent Partition Root"
    }
  },
  {
    id: "inv-24-02",
    code: "24.02",
    title: "Guest",
    subtitle: "El sistema operativo cliente ejecutado dentro del entorno virtualizado",
    targetMechanism: "Child Partition Isolation & Guest OS Engine",
    targetComponent: "vmicguestadditions / Integration Services",
    commandName: "Get-VM | Select-Object Name, State, CpuUsage, MemoryAssigned",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El sistema operativo Guest cree que está instalado en una computadora real con su propia BIOS, procesador, memoria RAM e interfaces de red.",
      mythVsTruth: {
        mentira: "Un virus dentro de un Guest puede infectar la BIOS de mi motherboard físico automáticamente.",
        verdad: "El Guest está encapsulado en un dominio de seguridad aislado (Child Partition) de donde no puede salir sin exploits de escape de hipervisor.",
        comprobalo: "Abre el Administrador de Dispositivos dentro de la VM Guest para ver cómo los dispositivos tienen nombres como 'Hyper-V Virtual IDE' o 'VirtualBox Graphics'."
      }
    },
    entende: {
      queEs: "La instancia aislada de un sistema operativo (Windows, Linux, macOS) que se ejecuta sobre el hardware virtual emulado o paravirtualizado.",
      paraQueSirve: "Permite probar software sospechoso, ejecutar entornos de prueba, desarrollar aplicaciones o aislar servicios de red.",
      quePasaSiFalta: "Un Guest dañado simplemente corrompe su archivo de disco virtual (.vhdx/.vmdk) sin alterar el Host."
    },
    interactua: {
      cliExample: "powershell Get-VMGuestPayment -VMName \"TestVM\"",
      psExample: "Get-VMIntegrationService -VMName \"Windows11_Guest\"",
      syntaxBreakdown: "Lista los servicios de integración (Guest Integration Services) instalados dentro del sistema cliente.",
      whatToLookFor: "Confirmar que servicios como 'Heartbeat' y 'Time Synchronization' estén marcados como Enabled.",
      technicalMetrics: "Aislamiento estricto de memoria RAM asignada al Guest."
    },
    alertaEVO: {
      reversibilityRule: "Instalar 'Guest Additions' o 'Integration Services' mejora la velocidad de video y permite copiar/pegar portapapeles entre Host y Guest.",
      safetyWarning: "No compartas carpetas del Host con permisos de escritura completa si estás ejecutando malware dentro del Guest."
    },
    evidenceBadge: {
      code: "VM-GST-02",
      label: "Guest Child Partition Domain"
    }
  },
  {
    id: "inv-24-03",
    code: "24.03",
    title: "Hypervisor",
    subtitle: "Diferencia entre Hipervisores Tipo 1 (Nativos) y Tipo 2 (Alojados)",
    targetMechanism: "Hardware Assisted Virtualization (Ring -1 / VMX)",
    targetComponent: "hvix64.exe / VMMR0.r0 / vmmon",
    commandName: "bcdedit /enum {current} | findstr hypervisorlaunchtype",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Los hipervisores de Tipo 1 (Bare-Metal como Hyper-V o ESXi) corren directamente sobre el hardware. Los de Tipo 2 (VirtualBox, VMware Workstation) corren como aplicaciones sobre el Host OS.",
      mythVsTruth: {
        mentira: "VirtualBox y Hyper-V son exactamente lo mismo porque ambos abren una ventana con un sistema operativo.",
        verdad: "Hyper-V convierte a Windows en una partición primaria sobre el hipervisor en Ring -1; VirtualBox tradicional corre en espacio de usuario.",
        comprobalo: "Revisa con bcdedit si 'hypervisorlaunchtype' está en 'Auto' (Hyper-V Tipo 1 activo)."
      }
    },
    entende: {
      queEs: "El monitor de máquinas virtuales (VMM) que intercepta instrucciones de CPU, gestiona tablas de páginas de memoria e interrupciones de hardware.",
      paraQueSirve: "Segmenta el hardware físico para brindar múltiples máquinas virtuales independientes con alto rendimiento.",
      quePasaSiFalta: "Sin habilitar la virtualización en la BIOS (Intel VT-x / AMD-V), las máquinas virtuales no podrán iniciarse en 64 bits."
    },
    interactua: {
      cliExample: "bcdedit /set hypervisorlaunchtype auto",
      psExample: "Get-Service hvhost | Select-Object Status, StartType",
      syntaxBreakdown: "Modifica las opciones de arranque del BCD para forzar la carga del hipervisor de Hyper-V al inicio del sistema.",
      whatToLookFor: "Valor 'hypervisorlaunchtype Auto' en el cargador de arranque de Windows.",
      technicalMetrics: "Acceso directo a CPU vía extensiones de virtualización (SLAT / EPT)."
    },
    alertaEVO: {
      reversibilityRule: "Para usar hipervisores Tipo 2 antiguos incompatibles con Hyper-V, podés ejecutar bcdedit /set hypervisorlaunchtype off.",
      safetyWarning: "Desactivar la virtualización en BIOS/UEFI romperá Windows Sandbox, WSL2 y Guard de Credenciales (VBS)."
    },
    evidenceBadge: {
      code: "VM-HYP-03",
      label: "Type-1 vs Type-2 Hypervisor Layer"
    }
  },
  {
    id: "inv-24-04",
    code: "24.04",
    title: "vCPU",
    subtitle: "Asignación y programación de núcleos virtuales y sobreasignación (overcommit)",
    targetMechanism: "CPU Scheduler & Virtual Processor Mapping",
    targetComponent: "vmwp.exe (Virtual Machine Worker Process)",
    commandName: "Set-VMProcessor -VMName \"TestVM\" -Count 4",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Si asignas 8 vCPUs a un Guest en un procesador físico de 4 núcleos, el hipervisor debe alternar los hilos ejecutando tiempo compartido (time-slicing), causando latencias.",
      mythVsTruth: {
        mentira: "Mientras más núcleos virtuales le asigne a la VM, más rápida funcionará sin importar cuántos núcleos físicos tenga mi procesador.",
        verdad: "Asignar más vCPUs que los núcleos físicos disponibles genera contención de CPU (CPU Ready Time / CPU Stutter).",
        comprobalo: "Observa en el Administrador de Tareas la CPU usada por el proceso vmwp.exe asociado a la máquina virtual."
      }
    },
    entende: {
      queEs: "La abstracción lógica de un núcleo de procesador presentada por el hipervisor al sistema operativo cliente.",
      paraQueSirve: "Permite distribuir la capacidad de cálculo entre el sistema anfitrión y múltiples clientes virtuales.",
      quePasaSiFalta: "Si asignas solo 1 vCPU a un sistema operativo moderno como Windows 11, la interfaz responderá de forma extremadamente lenta."
    },
    interactua: {
      cliExample: "powershell Set-VMProcessor -VMName \"Windows11\" -Count 2",
      psExample: "Get-VMProcessor -VMName \"Windows11\" | Select-Object Count, Reservation, Limit, Maximum",
      syntaxBreakdown: "Consulta la cantidad de vCPUs asignadas, el porcentaje de reserva garantizado y el límite máximo de CPU.",
      whatToLookFor: "Revisar si 'Count' es menor o igual al número de hilos lógicos de la CPU física.",
      technicalMetrics: "Proceso de trabajo vmwp.exe gestiona las llamadas de CPU del Guest."
    },
    alertaEVO: {
      reversibilityRule: "El número de vCPUs se puede cambiar en cualquier momento con la máquina virtual apagada.",
      safetyWarning: "No asignes el 100% de las vCPUs al Guest; reservá siempre al menos 2 núcleos físicos para el sistema Host."
    },
    evidenceBadge: {
      code: "VM-CPU-04",
      label: "vCPU Processor Allocation"
    }
  },
  {
    id: "inv-24-05",
    code: "24.05",
    title: "vRAM",
    subtitle: "Asignación estática versus dinámica de memoria virtual y Ballooning",
    targetMechanism: "Dynamic Memory Manager & Hyper-V Balloon Driver",
    targetComponent: "vmicresv.dll / Memory Dynamic Allocator",
    commandName: "Set-VMMemory -VMName \"TestVM\" -DynamicMemoryEnabled $true -MinimumBytes 2GB -StartupBytes 4GB -MaximumBytes 8GB",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Con Memoria Dinámica (Dynamic Memory), el hipervisor asigna RAM al Guest solo a medida que lo necesita y recupera RAM libre devolviéndola al Host mediante 'Ballooning'.",
      mythVsTruth: {
        mentira: "Si le asigno 8GB de RAM a una VM, esa RAM se reserva y desaparece por completo del Host de inmediato.",
        verdad: "Si está activa la Memoria Dinámica, la VM arranca consumiendo 2GB y solo se expande si sus aplicaciones lo requieren.",
        comprobalo: "En Hyper-V Manager, observa la columna 'Memoria Asignada' (Assigned Memory) fluctuar en tiempo real."
      }
    },
    entende: {
      queEs: "La porción de memoria RAM física del Host reservada o asignada dinámicamente para el espacio de direcciones de la máquina virtual.",
      paraQueSirve: "Optimiza la densidad de máquinas virtuales permitiendo ejecutar múltiples VMs en un mismo servidor o PC de escritorio.",
      quePasaSiFalta: "Si el Host se queda sin RAM física y las VMs requieren más memoria, el sistema entrará en Paging/Smart Paging ralentizando todo el equipo."
    },
    interactua: {
      cliExample: "powershell Get-VMMemory -VMName \"Windows11\"",
      psExample: "Get-VMMemory -VMName \"Windows11\" | Select-Object DynamicMemoryEnabled, Startup, Minimum, Maximum, Buffer",
      syntaxBreakdown: "Inspecciona la configuración de memoria dinámica, tamaño de arranque, mínimo, máximo y colchón de búfer (Buffer %).",
      whatToLookFor: "Confirmar que 'DynamicMemoryEnabled' sea True para optimizar la RAM.",
      technicalMetrics: "Tasa de compresión y devolución de memoria vía driver de ballooning VMM."
    },
    alertaEVO: {
      reversibilityRule: "Se puede alternar entre memoria estática y dinámica modificando la configuración de la VM mientras está apagada.",
      safetyWarning: "No configures el MaximumBytes por encima de la memoria RAM física real instalada en la placa madre."
    },
    evidenceBadge: {
      code: "VM-RAM-05",
      label: "vRAM Dynamic Ballooning"
    }
  },
  {
    id: "inv-24-06",
    code: "24.06",
    title: "Virtual disk",
    subtitle: "Formatos VHDX, VMDK, VDI y discos de expansión dinámica vs tamaño fijo",
    targetMechanism: "Virtual Hard Disk Provider & Storage Stack",
    targetComponent: "vhdmp.sys / virtio-blk / VHDX format",
    commandName: "Get-VHD -Path \"C:\\VMs\\Disk.vhdx\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Un disco virtual es simplemente un archivo grande en tu SSD (.vhdx, .vmdk o .vdi). Con expansión dinámica, ocupa solo los gigabytes reales de los archivos que guardas dentro.",
      mythVsTruth: {
        mentira: "Un disco virtual dinámico de 100GB ocupa inmediatamente 100GB en mi SSD real.",
        verdad: "Inicia pesando un par de megabytes y va creciendo a medida que el Guest escribe bloques de datos.",
        comprobalo: "Compara el tamaño del archivo .vhdx en el Explorador de Archivos contra el 'Tamaño del disco' informado dentro de la máquina virtual."
      }
    },
    entende: {
      queEs: "La representación en archivo del disco rígido o SSD físico que el Guest utiliza para instalar su sistema operativo.",
      paraQueSirve: "Simplifica respaldos, migraciones y clonación de entornos completos con solo copiar un archivo.",
      quePasaSiFalta: "Sin un disco virtual adjunto, la máquina virtual no tendrá dónde almacenar el sistema ni iniciar el boot."
    },
    interactua: {
      cliExample: "powershell Get-VHD -Path \"C:\\Hyper-V\\Virtual Hard Disks\\VM.vhdx\"",
      psExample: "Resize-VHD -Path \"C:\\VMs\\Windows.vhdx\" -SizeBytes 100GB",
      syntaxBreakdown: "Consulta o expande la capacidad máxima lógica de un disco virtual VHDX en Windows.",
      whatToLookFor: "Propiedad VhdType (Dynamic vs Fixed) y FileSize actual.",
      technicalMetrics: "Rendimiento I/O: los discos fijos ofrecen menor fragmentación; los dinámicos optimizan el espacio en disco."
    },
    alertaEVO: {
      reversibilityRule: "Los discos VHDX se pueden montar en el Host haciendo doble clic para inspeccionar su contenido sin encender la VM.",
      safetyWarning: "No borres un disco VHDX si la VM tiene instantáneas (Snapshots / Checkpoints) pendientes; arruinarás la cadena de diferencia."
    },
    evidenceBadge: {
      code: "VM-DSK-06",
      label: "Virtual Disk VHDX Storage"
    }
  },
  {
    id: "inv-24-07",
    code: "24.07",
    title: "Virtual NIC",
    subtitle: "Adaptadores de red virtuales y conmutadores vSwitch de Hyper-V",
    targetMechanism: "Hyper-V Virtual Network Switch Module",
    targetComponent: "vmswitch.sys / Virtual Network Adapter",
    commandName: "Get-VMSwitch | Select-Object Name, SwitchType, NetAdapterInterfaceDescription",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Las VMs no se conectan con cables físicos. Hyper-V crea un 'vSwitch' (Switch Virtual) en el kernel que conmuta tramas Ethernet entre las vNICs de las VMs y la placa real.",
      mythVsTruth: {
        mentira: "Las máquinas virtuales transmiten paquetes directo a la placa de red física sin pasar por ninguna pila de red del Host.",
        verdad: "Todo paquete pasa por el módulo vmswitch.sys del Host que filtra, conmuta e inspecciona el tráfico.",
        comprobalo: "Ejecutá 'Get-NetAdapter' en PowerShell para ver las placas virtuales creadas por Hyper-V o VirtualBox."
      }
    },
    entende: {
      queEs: "La tarjeta de interfaz de red virtual (vNIC) emulada o paravirtualizada adjunta a la máquina virtual.",
      paraQueSirve: "Permite la comunicación entre VMs, con el Host anfitrión o hacia la red LAN física e Internet.",
      quePasaSiFalta: "La máquina virtual funcionará en un aislamiento de red total (air-gapped) sin conectividad externa."
    },
    interactua: {
      cliExample: "powershell Get-VMNetworkAdapter -VMName \"TestVM\"",
      psExample: "Get-VMSwitch -SwitchType External | Select-Object Name, SwitchType, NetAdapterInterfaceDescription",
      syntaxBreakdown: "Lista los switches virtuales configurados en modo 'External' vinculados a una placa física de red.",
      whatToLookFor: "Identificar los nombres de los vSwitches activos (Default Switch, External Switch, Private Switch).",
      technicalMetrics: "Ancho de banda virtual interno entre VMs en el mismo Host: hasta 10Gbps - 40Gbps en RAM."
    },
    alertaEVO: {
      reversibilityRule: "Se puede cambiar el vSwitch al que está conectada una VM desde la configuración de red de la máquina virtual.",
      safetyWarning: "Modificar las propiedades del External vSwitch en una conexión remota RDP/SSH puede cortar el acceso al Host."
    },
    evidenceBadge: {
      code: "VM-NIC-07",
      label: "vSwitch Virtual Adapter"
    }
  },
  {
    id: "inv-24-08",
    code: "24.08",
    title: "NAT",
    subtitle: "Red en modo Traducción de Direcciones de Red (NAT)",
    targetMechanism: "Windows Internal NAT (WinNAT) Service",
    targetComponent: "winnat.sys / Default Switch",
    commandName: "Get-NetNat",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "En modo NAT (como el 'Default Switch' de Hyper-V), la VM obtiene una dirección IP privada (ej: 172.24.x.x) y el Host actúa como router con firewall para darle salida a Internet.",
      mythVsTruth: {
        mentira: "En modo NAT, otras computadoras de mi casa o trabajo pueden conectarse directamente a los servicios de mi máquina virtual.",
        verdad: "NAT aísla la VM: el Guest puede salir a Internet, pero nadie desde la red LAN física puede iniciar conexiones hacia el Guest.",
        comprobalo: "Compara la dirección IP asignada a la VM (ej: 172.20.x.x) con la IP del Host en tu red de casa (ej: 192.168.1.50)."
      }
    },
    entende: {
      queEs: "Un esquema de red virtualizada donde el Host enmascara el tráfico de la VM reemplazando la IP virtual por su propia IP pública/LAN.",
      paraQueSirve: "Brinda acceso a Internet inmediato a la máquina virtual sin requerir configurar IPs adicionales en el router de la casa.",
      quePasaSiFalta: "Sin NAT, tendrías que asignar IPs estáticas válidas en la subred de tu router físico para cada máquina virtual."
    },
    interactua: {
      cliExample: "powershell Get-NetNat",
      psExample: "Get-NetNatStaticMapping",
      syntaxBreakdown: "Muestra las reglas de reenvío de puertos (Port Forwarding) estáticas configuradas en el servicio WinNAT de Windows.",
      whatToLookFor: "Comprobar el nombre de la red NAT activa ('ICS' o 'DefaultSwitch').",
      technicalMetrics: "Traducción transparente de puertos y tablas de estado TCP/UDP en WinNAT."
    },
    alertaEVO: {
      reversibilityRule: "Podés crear redes NAT personalizadas en PowerShell con New-NetNat -Name \"MyNAT\" -InternalIPInterfaceAddressPrefix \"192.168.100.0/24\".",
      safetyWarning: "No uses modo NAT si necesitas montar un servidor web dentro de la VM visible para todos los equipos de la oficina."
    },
    evidenceBadge: {
      code: "VM-NAT-08",
      label: "WinNAT Switch Routing"
    }
  },
  {
    id: "inv-24-09",
    code: "24.09",
    title: "Bridged",
    subtitle: "Conexión de red en modo Puente (Bridged / External Switch)",
    targetMechanism: "Hyper-V External Virtual Switch & Promiscuous Bridge",
    targetComponent: "vmswitch.sys / Physical NIC Binding",
    commandName: "New-VMSwitch -Name \"ExternalSwitch\" -NetAdapterName \"Wi-Fi\" -AllowManagementOS $true",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "En modo Puente (Bridged), la máquina virtual se conecta directamente al switch o router físico como si fuera una computadora independiente conectada con un cable de red real.",
      mythVsTruth: {
        mentira: "El modo Puente comparte la misma dirección IP del Host.",
        verdad: "La VM solicita su propia dirección IP independiente al servidor DHCP de la red física (ej: 192.168.1.85).",
        comprobalo: "Haz ping desde otro celular o PC de tu casa directamente a la IP de la máquina virtual."
      }
    },
    entende: {
      queEs: "Una configuración de vSwitch que vincula la placa de red virtual de la VM con la placa de red física del Host en modo promiscuo/bridge.",
      paraQueSirve: "Permite exponer servidores (HTTP, SQL, Active Directory) que corren dentro de la VM hacia toda la red física local.",
      quePasaSiFalta: "Los dispositivos de la red local no podrán acceder directamente a los servicios alojados en la máquina virtual."
    },
    interactua: {
      cliExample: "powershell Get-VMSwitch -SwitchType External",
      psExample: "New-VMSwitch -Name \"BridgeLAN\" -NetAdapterName \"Ethernet\" -AllowManagementOS $true",
      syntaxBreakdown: "Crea un switch externo vinculado a la interfaz física 'Ethernet', permitiendo que el Host mantenga conectividad (AllowManagementOS).",
      whatToLookFor: "Confirmar que la VM recibe una IP del mismo rango del router (ej: 192.168.1.x).",
      technicalMetrics: "Rendimiento de red equivalente al hardware nativo de la placa física."
    },
    alertaEVO: {
      reversibilityRule: "Se puede eliminar el vSwitch puente y volver al Default Switch desde el Administrador de Conmutadores Virtuales.",
      safetyWarning: "Varios routers Wi-Fi bloquean múltiples direcciones MAC en la misma interfaz inalámbrica; es preferible usar red cableada para el modo Puente."
    },
    evidenceBadge: {
      code: "VM-BRG-09",
      label: "Bridged Physical Pass-Through"
    }
  },
  {
    id: "inv-24-10",
    code: "24.10",
    title: "Snapshot",
    subtitle: "Instantáneas de estado y puntos de control (Checkpoints) congelados",
    targetMechanism: "Differencing VHDX Disks & Saved State Snapshots",
    targetComponent: "vmwp.exe / AVHDX Differencing Chain",
    commandName: "Get-VMSnapshot -VMName \"TestVM\"",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Un Checkpoint toma una fotografía del estado del disco y la memoria RAM. Si rompes el sistema probando un archivo sospechoso, podés volver al pasado en solo 3 segundos.",
      mythVsTruth: {
        mentira: "Un Snapshot es una copia de seguridad (Backup) completa perfecta para guardar durante años.",
        verdad: "Las instantáneas crean cadenas de discos diferenciales (.avhdx) que degradan el rendimiento de I/O si se acumulan por mucho tiempo.",
        comprobalo: "Inspecciona la carpeta de la VM para ver cómo se crea un archivo .avhdx hijo al tomar una instantánea."
      }
    },
    entende: {
      queEs: "Una captura congelada del disco virtual y estado de memoria de una máquina virtual en un instante preciso del tiempo.",
      paraQueSirve: "Permite probar cambios arriesgados, parches o malware con la garantía de revertir todo al estado exacto previo.",
      quePasaSiFalta: "Si cometes un error dentro de la VM, tendrás que reinstalar o reparar el sistema operativo desde cero."
    },
    interactua: {
      cliExample: "powershell Checkpoint-VM -VMName \"Windows11\" -SnapshotName \"Antes_De_Probar_Patch\"",
      psExample: "Restore-VMSnapshot -VMName \"Windows11\" -Name \"Antes_De_Probar_Patch\" -Confirm:$false",
      syntaxBreakdown: "Crea o restaura un punto de control especificando el nombre de la máquina virtual.",
      whatToLookFor: "Verificar la existencia de archivos .avhdx en el directorio de almacenamiento.",
      technicalMetrics: "Tiempo de restauración: instantáneo (2-5 segundos)."
    },
    alertaEVO: {
      reversibilityRule: "Eliminar una instantánea en Hyper-V fusiona (merge) los cambios del disco diferencial con el disco base automáticamente.",
      safetyWarning: "No elimines archivos .avhdx manualmente desde el Explorador de Archivos; romperás la cadena de discos diferenciales."
    },
    evidenceBadge: {
      code: "VM-SNP-10",
      label: "AVHDX Differencing Snapshot"
    }
  },
  {
    id: "inv-24-11",
    code: "24.11",
    title: "Hyper-V",
    subtitle: "El hipervisor nativo de grado empresarial integrado en Windows Pro",
    targetMechanism: "Windows Hypervisor Management Platform",
    targetComponent: "virtmgmt.msc / vmms.exe (Virtual Machine Management Service)",
    commandName: "Get-Service vmms",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Hyper-V viene dentro de Windows 10/11 Pro, Enterprise y Education. No requiere descargar programas de terceros y ofrece el mayor rendimiento I/O en procesadores Intel/AMD.",
      mythVsTruth: {
        mentira: "Hyper-V es una utilidad básica y lenta comparada con los programas comerciales.",
        verdad: "Hyper-V es el mismo hipervisor empresarial Tipo 1 que impulsa la nube global de Microsoft Azure.",
        comprobalo: "Ejecutá 'virtmgmt.msc' en la ventana Ejecutar (Win+R) para abrir el Administrador de Hyper-V."
      }
    },
    entende: {
      queEs: "La plataforma de virtualización nativa de Microsoft integrada en las ediciones corporativas y avanzadas de Windows.",
      paraQueSirve: "Ejecutar servidores virtuales, entornos de desarrollo, laboratorios de ciberseguridad y máquinas cliente con aceleración por hardware.",
      quePasaSiFalta: "En ediciones Windows Home, Hyper-V no está disponible de forma nativa desde las características opcionales."
    },
    interactua: {
      cliExample: "Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All",
      psExample: "Get-VM | Select-Object Name, State, Uptime, Status",
      syntaxBreakdown: "Habilita la característica completa de Hyper-V (Herramientas de gestión e Hipervisor) en Windows Pro.",
      whatToLookFor: "Verificar que el servicio 'vmms' (Servicio de administración de Hyper-V) esté activo.",
      technicalMetrics: "Rendimiento nativo del hipervisor con soporte para Guarded Fabric y VBS."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desactivar Hyper-V con Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All.",
      safetyWarning: "Activar Hyper-V puede requerir reiniciar el sistema dos veces para reconfigurar el cargador de arranque del kernel."
    },
    evidenceBadge: {
      code: "VM-HPV-11",
      label: "Hyper-V Core Manager"
    }
  },
  {
    id: "inv-24-12",
    code: "24.12",
    title: "Windows Sandbox",
    subtitle: "Entorno desechable ultraligero y seguro integrado en el sistema",
    targetMechanism: "Windows Sandbox Container & Dynamic Base Image",
    targetComponent: "WindowsSandbox.exe / CmsiService",
    commandName: "Get-WindowsOptionalFeature -Online -FeatureName Containers-DisposableClientVM",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Abris Windows Sandbox en 5 segundos, ejecutas un archivo SOSPECHOSO.exe, lo cerras y desaparece TODO sin dejar rastro alguno en tu computadora.",
      mythVsTruth: {
        mentira: "Windows Sandbox requiere descargar una imagen ISO de Windows de 5 Gigabytes.",
        verdad: "Sandbox reutiliza los archivos del sistema operativo Host mediante una imagen base dinámica enlazada con copia en escritura (Copy-on-Write).",
        comprobalo: "Inicia 'Windows Sandbox' desde el menú inicio y comprueba que arranca un escritorio limpio en segundos sin pedir instalación."
      }
    },
    entende: {
      queEs: "Un entorno de escritorio desechable basado en contenedores e hipervisor Hyper-V diseñado para la ejecución segura de software no confiable.",
      paraQueSirve: "Analizar descargas sospechosas, probar instaladores desconocidos o navegar en sitios potencialmente infecciosos sin riesgo.",
      quePasaSiFalta: "Tendrás que crear una máquina virtual completa en Hyper-V/VirtualBox cada vez que quieras aislar un archivo."
    },
    interactua: {
      cliExample: "WindowsSandbox.exe",
      psExample: "Enable-WindowsOptionalFeature -Online -FeatureName Containers-DisposableClientVM -All",
      syntaxBreakdown: "Activa la característica opcional de Windows Sandbox en ediciones Windows 10/11 Pro o superiores.",
      whatToLookFor: "Apertura instantánea de la ventana de Sandbox con un escritorio Windows fresco.",
      technicalMetrics: "Consumo inicial de RAM: ~500MB; inicio ultra-rápido en 3-8 segundos."
    },
    alertaEVO: {
      reversibilityRule: "Al cerrar la ventana de Windows Sandbox, absolutamente todo el estado de la sesión se borra de manera irreversible.",
      safetyWarning: "Guarda cualquier archivo útil fuera del Sandbox antes de cerrarlo, ya que la sesión no se puede guardar ni pausar."
    },
    evidenceBadge: {
      code: "VM-SBX-12",
      label: "Windows Sandbox Container"
    }
  },
  {
    id: "inv-24-13",
    code: "24.13",
    title: "VirtualBox",
    subtitle: "El hipervisor Tipo 2 multiplataforma de código abierto de Oracle",
    targetMechanism: "Oracle VM VirtualBox Engine",
    targetComponent: "VBoxManage.exe / VBoxHeadless.exe",
    commandName: "VBoxManage -v",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "VirtualBox es gratuito, de código abierto y funciona en Windows, Linux y macOS. Su formato de disco VDI es ideal para aprender virtualización en cualquier sistema operativo.",
      mythVsTruth: {
        mentira: "VirtualBox no funciona en Windows 11 si Hyper-V está activo.",
        verdad: "Las versiones modernas de VirtualBox (6.1+) pueden utilizar la API 'NEM' (Native Execution Manager) de Hyper-V como motor de virtualización.",
        comprobalo: "Abre VirtualBox y observa el icono de la tortuga verde (modo Hyper-V) o VMPX en la barra de estado inferior."
      }
    },
    entende: {
      queEs: "Un software de virtualización alojado (Tipo 2) ampliamente utilizado para entornos educativos, pruebas multiplataforma y laboratorios informáticos.",
      paraQueSirve: "Facilita la creación e importación de máquinas virtuales empaquetadas en formato OVA/OVF en cualquier sistema operativo.",
      quePasaSiFalta: "Menor flexibilidad para transportar máquinas virtuales hacia sistemas que no sean Windows."
    },
    interactua: {
      cliExample: "VBoxManage list vms",
      psExample: "Get-Process VBoxSVC | Select-Object Id, CPU, WorkingSet64",
      syntaxBreakdown: "Invoca la potente herramienta de línea de comandos VBoxManage para listar las máquinas virtuales registradas.",
      whatToLookFor: "Lista de máquinas virtuales y UUIDs asociados.",
      technicalMetrics: "Soporte multiplataforma e integración con Guest Additions."
    },
    alertaEVO: {
      reversibilityRule: "Instalar el 'VirtualBox Extension Pack' agrega soporte para passthrough USB 3.0 y cifrado de disco.",
      safetyWarning: "Revisa la licencia comercial de Oracle antes de desplegar el Extension Pack en entornos corporativos."
    },
    evidenceBadge: {
      code: "VM-VBX-13",
      label: "VirtualBox VBoxManage Engine"
    }
  },
  {
    id: "inv-24-14",
    code: "24.14",
    title: "VMware",
    subtitle: "VMware Workstation Pro y soluciones de virtualización de alto rendimiento",
    targetMechanism: "VMware Workstation Virtual Machine Monitor",
    targetComponent: "vmware.exe / vmware-vmx.exe",
    commandName: "Get-Process vmware-vmx",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "VMware Workstation Pro destaca por su aceleración gráfica 3D (DirectX 11 / OpenGL) que permite ejecutar aplicaciones de diseño y juegos dentro del Guest con fluidez.",
      mythVsTruth: {
        mentira: "Ninguna máquina virtual puede acelerar gráficos 3D por hardware.",
        verdad: "VMware traduce las llamadas DirectX del Guest hacia la GPU real del Host con baja latencia.",
        comprobalo: "Inicia dxdiag dentro de una VM de VMware con VMware Tools instaladas y comprueba 'Aceleración de Direct3D: Activada'."
      }
    },
    entende: {
      queEs: "Una suite de virtualización profesional alojada de alto rendimiento diseñada para ingenieros de software, administradores de red y especialistas en ciberseguridad.",
      paraQueSirve: "Simular redes complejas, ejecutar imágenes vApp y ofrecer la máxima aceleración 3D en máquinas cliente.",
      quePasaSiFalta: "Las aplicaciones que requieren aceleración de video intensiva en el Guest tendrán un rendimiento limitado."
    },
    interactua: {
      cliExample: "\"C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe\" list",
      psExample: "Get-Service -Name \"VMware*\" | Select-Object Name, Status, StartType",
      syntaxBreakdown: "Lista los servicios en segundo plano instalados por VMware (VMAuthdService, VMnetDHCP, VMware NAT).",
      whatToLookFor: "Servicios activos para redes virtuales VMnet1 (Host-Only) y VMnet8 (NAT).",
      technicalMetrics: "Aceleración Direct3D 11 y OpenGL 4.3 en el Guest."
    },
    alertaEVO: {
      reversibilityRule: "Instalar VMware Tools es obligatorio para habilitar la resolución de pantalla dinámica y arrastrar/soltar archivos.",
      safetyWarning: "No desactives los servicios de red VMnet8 si utilizas conexiones NAT dentro de las VMs de VMware."
    },
    evidenceBadge: {
      code: "VM-VMW-14",
      label: "VMware Workstation VMX Engine"
    }
  },
  {
    id: "inv-24-15",
    code: "24.15",
    title: "WSL",
    subtitle: "Windows Subsystem for Linux v1 (Traducción de Syscalls)",
    targetMechanism: "LXSS (Linux Subsystem for Windows) Emulation Layer",
    targetComponent: "lxssmanager.dll / lxss.sys",
    commandName: "wsl --list --verbose",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "WSL1 no ejecutaba un núcleo Linux ni una máquina virtual: traducía las llamadas de sistema (syscalls) de Linux directamente en llamadas nativas del kernel NT de Windows.",
      mythVsTruth: {
        mentira: "WSL1 usaba una máquina virtual pesada como VirtualBox en segundo plano.",
        verdad: "WSL1 era una capa de traducción nativa en el kernel sin hipervisor ni máquina virtual.",
        comprobalo: "En WSL1, ejecuta 'uname -r' y verás un número de versión personalizado de Microsoft sobre el kernel NT."
      }
    },
    entende: {
      queEs: "La primera generación del subsistema Linux en Windows que emulaba la API de POSIX/Linux sobre el kernel de Windows NT.",
      paraQueSirve: "Ofrecía acceso ultra-rápido al sistema de archivos de Windows desde la consola de Bash.",
      quePasaSiFalta: "No podía ejecutar aplicaciones que requerían llamadas de sistema no implementadas o contenedores Docker nativos."
    },
    interactua: {
      cliExample: "wsl --set-version Ubuntu 1",
      psExample: "Get-Service LxssManager | Select-Object Status, StartType",
      syntaxBreakdown: "Consulta el estado del servicio LxssManager encargado de la gestión de instancias WSL1.",
      whatToLookFor: "Confirmar versión 1 en la columna 'VERSION' de 'wsl -l -v'.",
      technicalMetrics: "Uso de RAM: prácticamente cero cuando no se ejecutan comandos."
    },
    alertaEVO: {
      reversibilityRule: "Se puede convertir una distribución entre WSL1 y WSL2 usando wsl --set-version <Distro> <1|2>.",
      safetyWarning: "WSL1 está desaconsejado para ejecutar Docker o tecnologías que requieran llamadas de kernel Linux reales."
    },
    evidenceBadge: {
      code: "VM-WSL1-15",
      label: "WSL1 LXSS Translation Engine"
    }
  },
  {
    id: "inv-24-16",
    code: "24.16",
    title: "WSL2",
    subtitle: "Windows Subsystem for Linux v2 (Kernel Linux Real sobre Hyper-V)",
    targetMechanism: "Lightweight Utility VM & Real Linux Kernel",
    targetComponent: "vmsrv / vhdx / ext4.vhdx / wslhost.exe",
    commandName: "wsl --status",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "WSL2 incluye un núcleo Linux real (Linux Kernel) optimizado por Microsoft que corre dentro de una máquina virtual ligera sobre Hyper-V con compatibilidad del 100% con Syscalls.",
      mythVsTruth: {
        mentira: "WSL2 tarda minutos en iniciar como una máquina virtual tradicional.",
        verdad: "WSL2 se enciende en menos de 1 segundo y asigna memoria dinámicamente según la carga.",
        comprobalo: "Ejecutá 'wsl' en la terminal y ejecuta 'uname -a' para ver el kernel oficial de Linux de Microsoft."
      }
    },
    entende: {
      queEs: "La arquitectura moderna de subsistema Linux que combina la velocidad de una VM ligera con la integración nativa en el escritorio de Windows.",
      paraQueSirve: "Ejecutar Docker Desktop, herramientas de desarrollo de Linux, servidores Node/Python y aplicaciones gráficas GUI (WSLg) sin salir de Windows.",
      quePasaSiFalta: "Incapacidad de ejecutar Docker Desktop de forma nativa o entornos de desarrollo Linux con rendimiento completo."
    },
    interactua: {
      cliExample: "wsl --update",
      psExample: "wsl --list --verbose",
      syntaxBreakdown: "Lista las distribuciones de Linux instaladas, su estado (Running/Stopped) y la versión de arquitectura (WSL 2).",
      whatToLookFor: "Confirmar 'VERSION 2' en la distribución predeterminada.",
      technicalMetrics: "Acceso al sistema de archivos ext4 almacenado en %LOCALAPPDATA%\\Packages\\...\\LocalState\\ext4.vhdx."
    },
    alertaEVO: {
      reversibilityRule: "Podés limitar el consumo máximo de RAM de WSL2 creando un archivo .wslconfig en tu carpeta de usuario.",
      safetyWarning: "Si guardas archivos de proyecto de Linux en la partición C: de Windows, el acceso de E/S en WSL2 será más lento que guardarlos dentro de la partición ext4 nativa (~/)."
    },
    evidenceBadge: {
      code: "VM-WSL2-16",
      label: "WSL2 Real Linux Kernel"
    }
  },
  {
    id: "inv-24-17",
    code: "24.17",
    title: "Cuándo usar cada uno",
    subtitle: "Matriz técnica de decisión: Sandbox vs WSL2 vs Hyper-V vs VirtualBox vs VMware",
    targetMechanism: "Virtualization Architecture Decision Engine",
    targetComponent: "All Virtualization Technologies",
    commandName: "Get-Command wsl, WindowsSandbox, virtmgmt.msc -ErrorAction SilentlyContinue",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Dudas entre usar Sandbox, WSL2, Hyper-V, VirtualBox o VMware? Cada tecnología responde a un caso de uso específico según velocidad, persistencia y rendimiento gráfico.",
      mythVsTruth: {
        mentira: "Existe una única herramienta de virtualización perfecta para todos los escenarios.",
        verdad: "La elección depende de las necesidades: Sandbox para pruebas desechables; WSL2 para desarrollo; Hyper-V para servidores; VMware/VirtualBox para entornos de laboratorio complejos.",
        comprobalo: "Aplica la matriz EVO para elegir la mejor herramienta en menos de 10 segundos."
      }
    },
    entende: {
      queEs: "El marco metodológico de decisión para seleccionar la solución de aislamiento o virtualización adecuada según el objetivo técnico.",
      paraQueSirve: "Evita desperdiciar espacio en disco, memoria RAM y tiempo de configuración utilizando la herramienta óptima.",
      quePasaSiFalta: "Elegir la herramienta equivocada puede resultar en sistemas lentos, carpetas compartidas ineficientes o pérdida inadvertida de datos."
    },
    interactua: {
      cliExample: "echo Sandbox: Efímero | WSL2: Dev Linux | Hyper-V: Servidores | VMware: 3D/Lab",
      psExample: "Write-Output \"Matriz EVO de Virtualización Carga Correctamente\"",
      syntaxBreakdown: "Resumen ejecutivo de asignación de tecnologías según el propósito operativo.",
      whatToLookFor: "Seleccionar la tecnología óptima evaluando Persistencia, Rendimiento 3D y Aislamiento.",
      technicalMetrics: "Evaluación multidimensional de consumo de RAM, I/O de disco y latencia de inicio."
    },
    alertaEVO: {
      reversibilityRule: "Todas las tecnologías pueden coexistir en la misma instalación de Windows 10/11 Pro.",
      safetyWarning: "Monitorea la acumulación de discos VHDX/VMDK en tu SSD para prevenir quedarte sin espacio en el Host."
    },
    evidenceBadge: {
      code: "VM-DEC-17",
      label: "Virtualization Decision Matrix"
    }
  }
];

export const SECTOR_24_MINICASES: Sector24MiniCase[] = [
  {
    id: "case-24-01",
    code: "CASO-24-A",
    title: "VirtualBox no inicia máquinas virtuales de 64 bits",
    scenario: "Un estudiante intenta crear una máquina virtual de Ubuntu 64 bits en VirtualBox, pero la aplicación solo le permite seleccionar opciones de 32 bits.",
    userStatement: "Mi procesador Intel Core i7 no soporta 64 bits para virtualización.",
    initialMistake: "Desinstalar VirtualBox creyendo que la aplicación es incompatible con su procesador.",
    diagnosticQuestion: "¿Qué opción fundamental está desactivada en la BIOS/UEFI de la placa madre?",
    options: [
      {
        id: "opt-1",
        text: "La opción de virtualización asistida por hardware (Intel VT-x / AMD-V) en la BIOS/UEFI.",
        isCorrect: true,
        explanation: "Para ejecutar hipervisores y clientes de 64 bits es obligatorio habilitar Intel VT-x o AMD-V en el firmware UEFI del motherboard."
      },
      {
        id: "opt-2",
        text: "La aceleración de tarjeta de red Ethernet.",
        isCorrect: false,
        explanation: "La tarjeta de red no limita la arquitectura de bits del procesador virtual."
      },
      {
        id: "opt-3",
        text: "El perfil XMP de la memoria RAM.",
        isCorrect: false,
        explanation: "XMP gestiona frecuencias de RAM pero no las instrucciones de virtualización de 64 bits."
      }
    ],
    technicalVerdict: "VIRTUALIZACIÓN DESACTIVADA EN FIRMWARE: Habilitar VT-x / AMD-V en BIOS resuelve la restricción de 64 bits.",
    lessonLearned: "Verificá siempre el estado de virtualización en la pestaña Rendimiento -> CPU del Administrador de Tareas."
  },
  {
    id: "case-24-02",
    code: "CASO-24-B",
    title: "Docker Desktop extremadamente lento en Windows",
    scenario: "Un desarrollador nota que sus contenedores de Docker tardan minutos en responder y consumen 100% de CPU constante.",
    userStatement: "Docker no sirve para Windows, tengo que instalar Linux como sistema operativo único.",
    initialMistake: "Formatear la computadora para instalar Ubuntu Linux.",
    diagnosticQuestion: "¿Qué motor de virtualización antiguo estaba usando Docker en lugar del backend moderno?",
    options: [
      {
        id: "opt-1",
        text: "Estaba usando el backend antiguo basado en una VM pesada de Hyper-V en lugar de la integración nativa de WSL2.",
        isCorrect: true,
        explanation: "WSL2 utiliza un kernel de Linux real ligero integrado con el sistema de archivos ext4, aumentando la velocidad de Docker hasta 10 veces."
      },
      {
        id: "opt-2",
        text: "La falta de espacio en la papelera de reciclaje de Windows.",
        isCorrect: false,
        explanation: "La papelera de reciclaje no afecta la velocidad de ejecución de contenedores Docker."
      },
      {
        id: "opt-3",
        text: "El uso de la calculadora de Windows en segundo plano.",
        isCorrect: false,
        explanation: "La calculadora no interfiere con el rendimiento del subsistema Docker."
      }
    ],
    technicalVerdict: "MIGRACIÓN A BACKEND WSL2 REQUERIDA: WSL2 brinda rendimiento de E/S cercano al nativo para contenedores.",
    lessonLearned: "Configurá Docker Desktop para utilizar el backend WSL2 ('Use the WSL 2 based engine')."
  },
  {
    id: "case-24-03",
    code: "CASO-24-C",
    title: "Infección accidental por probar un ransomware dentro de la VM",
    scenario: "Un analista de seguridad ejecuta un ejecutable malicioso dentro de una VM de pruebas y descubre que encriptó los archivos personales de su carpeta Documentos del Host.",
    userStatement: "El malware logró romper el hipervisor con un exploit de Kernel Escape impredecible.",
    initialMistake: "Concluir que los hipervisores no sirven para aislamiento de seguridad.",
    diagnosticQuestion: "¿Qué función de conveniencia mal configurada permitió la propagación hacia el Host?",
    options: [
      {
        id: "opt-1",
        text: "Tener carpetas compartidas (Shared Folders) activadas entre Host y Guest con permisos de Escritura Completa.",
        isCorrect: true,
        explanation: "El ransomware no 'escapó' del hipervisor; simplemente leyó la ruta de red o carpeta compartida de Windows montada con permisos de escritura."
      },
      {
        id: "opt-2",
        text: "Tener el monitor del Host encendido a máxima resolución.",
        isCorrect: false,
        explanation: "La resolución de pantalla no influye en los permisos de archivos."
      },
      {
        id: "opt-3",
        text: "Tener el ratón conectado por puerto USB 3.0.",
        isCorrect: false,
        explanation: "El ratón no transmite infecciones de archivos hacia el sistema anfitrión."
      }
    ],
    technicalVerdict: "CONFIGURACIÓN DE AISLAMIENTO INSUFICIENTE: Desactivar Shared Folders y la red en laboratorios de análisis de malware.",
    lessonLearned: "Para aislar malware, utiliza Windows Sandbox o VMs con carpetas compartidas deshabilitadas y red aislada."
  }
];

export const SECTOR_24_TEST_BANK: Sector24TestQuestion[] = [
  {
    id: "test-24-01",
    questionNumber: 1,
    category: "Hypervisor Architecture",
    question: "¿Qué diferencia fundamental define a un Hipervisor de Tipo 1 (Bare-Metal) como Hyper-V respecto a uno de Tipo 2?",
    options: [
      { id: "a", text: "El Hipervisor Tipo 1 corre directamente sobre el hardware físico en Ring -1, convirtiendo al Host OS en una partición primaria" },
      { id: "b", text: "El Tipo 1 requiere internet obligatoriamente para encender las VMs" },
      { id: "c", text: "El Tipo 1 solo funciona en computadoras portátiles" },
      { id: "d", text: "El Tipo 1 no puede ejecutar Linux" }
    ],
    correctOptionId: "a",
    technicalExplanation: "Los hipervisores Tipo 1 se inicializan antes que el sistema operativo principal aprovechando las extensiones de hardware de la CPU.",
    relatedInvestigationCode: "24.03"
  },
  {
    id: "test-24-02",
    questionNumber: 2,
    category: "Network Modes",
    question: "¿En qué modo de red virtual la máquina virtual obtiene su propia dirección IP en la misma subred física del router de la casa o empresa?",
    options: [
      { id: "a", text: "Modo NAT (Network Address Translation)" },
      { id: "b", text: "Modo Puente (Bridged / External Switch)" },
      { id: "c", text: "Modo Privado sin salida" },
      { id: "d", text: "Modo Avión" }
    ],
    correctOptionId: "b",
    technicalExplanation: "El modo Puente (Bridged) conecta la vNIC virtual directamente a la interfaz física como un dispositivo más en la red LAN.",
    relatedInvestigationCode: "24.09"
  },
  {
    id: "test-24-03",
    questionNumber: 3,
    category: "Windows Sandbox",
    question: "¿Qué sucede con todos los archivos guardados y programas instalados dentro de Windows Sandbox cuando se cierra la ventana?",
    options: [
      { id: "a", text: "Se guardan automáticamente en la carpeta Descargas del Host" },
      { id: "b", text: "Se descartan y eliminan de manera irreversible y permanente" },
      { id: "c", text: "Se suben a OneDrive en una carpeta oculta" },
      { id: "d", text: "Se convierten en un punto de restauración" }
    ],
    correctOptionId: "b",
    technicalExplanation: "Windows Sandbox es un entorno efímero y desechable; al cerrar la sesión se destruye el contenedor completo.",
    relatedInvestigationCode: "24.12"
  },
  {
    id: "test-24-04",
    questionNumber: 4,
    category: "WSL Architecture",
    question: "¿Qué arquitectura utiliza WSL2 para lograr compatibilidad total con llamadas de sistema (Syscalls) de Linux?",
    options: [
      { id: "a", text: "Traducción de código ejecutable de Linux a Win32 en tiempo real" },
      { id: "b", text: "Un kernel de Linux real optimizado por Microsoft ejecutado en una VM ligera sobre Hyper-V" },
      { id: "c", text: "Un emulador Java en el navegador web" },
      { id: "d", text: "Un script de Batch que ejecuta comandos de PowerShell" }
    ],
    correctOptionId: "b",
    technicalExplanation: "WSL2 incluye un núcleo de Linux real para garantizar el 100% de compatibilidad con binarios nativos y contenedores.",
    relatedInvestigationCode: "24.16"
  },
  {
    id: "test-24-05",
    questionNumber: 5,
    category: "Snapshots & Checkpoints",
    question: "¿Por qué no se deben mantener instantáneas (Checkpoints / Snapshots) durante meses en máquinas virtuales de producción?",
    options: [
      { id: "a", text: "Porque provocan el borrado automático de la memoria RAM del equipo" },
      { id: "b", text: "Porque generan una cadena de discos diferenciales (.avhdx) que aumenta la fragmentación y degrada el rendimiento de lectura y escritura" },
      { id: "c", text: "Porque obligan a cambiar la contraseña del usuario" },
      { id: "d", text: "Porque desactivan la tarjeta de red de la computadora" }
    ],
    correctOptionId: "b",
    technicalExplanation: "Las instantáneas acumulan escrituras en discos de diferencia que incrementan la latencia de I/O y consumen espacio adicional en el SSD.",
    relatedInvestigationCode: "24.10"
  }
];
