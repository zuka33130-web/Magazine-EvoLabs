import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';
export const EVO_W50_LABS_B: EvoWindowsFieldLab[] = [
  {
    "number": 11,
    "discovery": "La cámara puede figurar disponible aun cuando ninguna aplicación tenga permiso explícito; el control útil exige distinguir hardware presente, permiso y utilización documentada.",
    "mechanism": "Los dispositivos de vídeo aparecen en PnP, mientras las opciones de privacidad administran acceso de aplicaciones. Una cámara integrada con LED no equivale a un registro forense de capturas; el estado de drivers y el LED son indicadores diferentes.",
    "preparation": "No tomes fotografías de personas. Tené a mano una aplicación propia de cámara para una prueba consentida.",
    "experiment": [
      "Identificá los dispositivos de imagen y su estado.",
      "Abrí Configuración > Privacidad y seguridad > Cámara y anotá los permisos relevantes.",
      "Realizá una prueba voluntaria con la app Cámara, cerrala y observá cambios; no conviertas la ausencia de registros en prueba de seguridad total."
    ],
    "command": "Get-PnpDevice -Class Camera,Image -ErrorAction SilentlyContinue |\n select Class,FriendlyName,Status,InstanceId\nStart-Process 'ms-settings:privacy-webcam'",
    "evidence": "Un dispositivo registrado y habilitado es distinto de una aplicación usando la cámara; permisos por aplicación no ofrecen historial forense completo.",
    "pitfall": "La cámara puede estar deshabilitada físicamente o no tener un indicador luminoso; un listado PnP no acredita grabación previa.",
    "action": "Revocá acceso innecesario tras comprobar aplicaciones de videollamadas, accesibilidad y seguridad.",
    "recovery": "La consulta no cambia nada; permisos cambiados manualmente pueden restablecerse con su valor documentado.",
    "challenge": "Escribí la diferencia entre 'cámara instalada', 'permiso disponible' y 'uso comprobado'.",
    "references": [
      {
        "name": "Windows privacy settings",
        "url": "https://support.microsoft.com/en-us/windows/windows-privacy-settings"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 12,
    "discovery": "No todos los Windows 11 pueden guardar instantáneas Recall. La compatibilidad, activación, permisos y política de la organización deciden si existe esa función.",
    "mechanism": "Recall es una característica vinculada a equipos Copilot+ compatibles y su disponibilidad y opciones pueden cambiar con la versión. No confundas capturas del sistema con historial del navegador, indexación o actividad de otras apps.",
    "preparation": "Anotá edición, build y si el equipo es Copilot+; no habilites ninguna captura para hacer una demostración.",
    "experiment": [
      "Verificá edición, build y características disponibles.",
      "Buscá las opciones de Recall e instantáneas, si existen, en la configuración de privacidad.",
      "Documentá si la función está ausente, presente/desactivada o activa; no deduzcas grabación sin evidencia."
    ],
    "command": "Get-ComputerInfo | select WindowsProductName,WindowsVersion,OsBuildNumber\nGet-CimInstance Win32_Processor | select Name\nStart-Process 'ms-settings:privacy'",
    "evidence": "La ausencia en el panel de configuración indica que no está disponible en esa experiencia o configuración observada, pero no audita las capturas que hayan hecho otras aplicaciones.",
    "pitfall": "Un artículo viral puede mostrar otra compilación o dispositivo Copilot+. No atribuís Recall a un PC por usar Windows 11 solamente.",
    "action": "Si está disponible, revisá sus controles específicos y las políticas antes de compartir datos sensibles.",
    "recovery": "No se habilitan ni deshabilitan funciones automáticamente.",
    "challenge": "Compará compatibilidad del hardware con presencia real de la característica y explicá las diferencias.",
    "references": [
      {
        "name": "Microsoft Windows privacy",
        "url": "https://support.microsoft.com/en-us/windows/privacy-and-security"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 13,
    "discovery": "El tráfico de servicios de Windows debe identificarse por proceso y contexto, no llamarse espionaje a una conexión sin interpretar.",
    "mechanism": "Telemetría, mantenimiento, hora, licencias, noticias y comprobaciones de conectividad pueden usar servicios y conexiones distintas. Una conexión HTTPS no revela contenido por sí misma.",
    "preparation": "No hagas interceptación TLS ni cambios de firewall. Tomá muestras de tu propio equipo sin publicar IPs o identificadores.",
    "experiment": [
      "Medí conexiones establecidas y PID durante una ventana corta.",
      "Observá diferencias al desactivar sólo temporalmente una aplicación propia, no servicios críticos.",
      "Documentá hipótesis alternativas y buscá documentación oficial antes de concluir."
    ],
    "command": "Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue |\n Group-Object OwningProcess | Sort-Object Count -Descending |\n Select-Object -First 10 Name,Count\nGet-Process | Select-Object Name,Id,Path | Sort-Object Name",
    "evidence": "Obtendrás PID con conexiones en ese instante, no volúmenes ni contenido. Los PID cambian y el host puede compartir componentes.",
    "pitfall": "No confundas endpoint de Microsoft/CDN con contenido personal transmitido; diagnóstico no es interceptación de datos.",
    "action": "Revisá opciones oficiales de diagnóstico y privacidad de Windows, sin 'bloqueadores de telemetría' que rompan seguridad o actualizaciones.",
    "recovery": "Consultas sin cambios.",
    "challenge": "Seleccioná dos conexiones explicables y una incierta; escribí qué evidencia falta.",
    "references": [
      {
        "name": "Required service data",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 14,
    "discovery": "Win+V desactivado NO impide que otro programa de tu propia sesión lea el portapapeles actual. Historial y contenido presente son superficies distintas.",
    "mechanism": "Las APIs del portapapeles permiten compartir datos entre procesos y notificar cambios. Win+V agrega historial opcional; sincronización entre dispositivos y gestores de terceros son vías separadas.",
    "preparation": "USÁ EXCLUSIVAMENTE EL MARCADOR INVENTADO EVO-CLIP-LAB-014. No copies contraseñas reales ni compartas capturas con datos privados.",
    "experiment": [
      "Copiá el marcador ficticio desde Bloc de notas.",
      "En otra PowerShell local comprobá si el contenido ACTUAL coincide con el marcador sin usar pegar.",
      "Abrí Win+V y verificá si el historial está habilitado; no hace falta modificarlo.",
      "Reemplazá el marcador con otro texto ficticio y compará cómo cambian contenido actual e historial."
    ],
    "command": "$marker='EVO-CLIP-LAB-014'\n$actual=Get-Clipboard -Raw\nif($actual -eq $marker) {\n 'OTRA VENTANA LEYÓ EL MARCADOR SIN PEGARLO'\n} else { 'No coincide: comprobá tiempo y contenido' }\nRemove-Variable actual -ErrorAction SilentlyContinue",
    "evidence": "Coincidencia demuestra que la otra consola de TU sesión pudo leer el contenido actual. No prueba que malware haya leído nada.",
    "pitfall": "Historial desactivado no es control de acceso al portapapeles actual; un gestor puede mantener copia privada aunque Win+V esté vacío.",
    "action": "Usá autocompletar de un gestor confiable cuando sea viable; revisá gestores y redirección de portapapeles autorizada.",
    "recovery": "Cambiá el marcador por otro contenido ficticio; comprobar Win+V y eliminar manualmente entradas de prueba si corresponde.",
    "challenge": "Demostrá lectura local con Win+V apagado y explicá qué afirmación NO podés demostrar.",
    "references": [
      {
        "name": "Clipboard operations",
        "url": "https://learn.microsoft.com/en-us/windows/win32/dataxchg/clipboard-operations"
      },
      {
        "name": "Get-Clipboard",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-clipboard"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 15,
    "discovery": "Desactivar un selector de diagnóstico no equivale a apagar todas las comunicaciones del equipo ni garantiza que una app de terceros haya dejado de enviar datos.",
    "mechanism": "El nivel de datos de diagnóstico requerido/opcional es una política de Windows y no una instrucción universal para bloquear red. Cambia por edición, configuración de organización y versión.",
    "preparation": "Guardá captura del estado actual y edición. No cambies servicios, hosts, firewall ni directivas sin política y rollback.",
    "experiment": [
      "Abrí Configuración > Privacidad y seguridad > Diagnósticos y comentarios.",
      "Registrá opción disponible y si está gestionada por la organización.",
      "Relacioná esto con la documentación de Microsoft sobre required service data; no interpretes conexiones TCP genéricas como telemetría."
    ],
    "command": "Get-ComputerInfo | select WindowsProductName,WindowsVersion,OsBuildNumber\nStart-Process 'ms-settings:privacy-feedback'\nGet-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -ErrorAction SilentlyContinue |\n Format-List",
    "evidence": "Podés ver estado y algunas políticas si existen; ausencia de clave no significa que no se compartan datos operativos necesarios.",
    "pitfall": "Un tweak de Registro de un vídeo antiguo puede estar obsoleto o no tener efecto en la edición actual.",
    "action": "Ajustá controles soportados y revisá la política corporativa; no deshabilites Windows Update como supuesto método de privacidad.",
    "recovery": "Solo lectura salvo cambios manuales de interfaz; guardá ajustes anteriores.",
    "challenge": "Separá 'datos opcionales', 'datos requeridos' y 'tráfico de terceros'.",
    "references": [
      {
        "name": "Required diagnostic data",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 16,
    "discovery": "Una auditoría de privacidad útil distingue permisos potenciales, accesos observados y retención de datos. Un solo interruptor no cubre las tres categorías.",
    "mechanism": "Windows ofrece permisos por capacidad, aplicaciones y cuentas, con políticas distintas para aplicaciones de escritorio. La auditoría debe etiquetar evidencia y ausencia de evidencia.",
    "preparation": "No imprimas credenciales, historial del portapapeles ni rutas privadas. Usá tabla propia Sí/No/Desconocido.",
    "experiment": [
      "Revisá micrófono, cámara, ubicación, historial y sincronización en sus paneles.",
      "Documentá cuentas adicionales y apps de escritorio que necesitan esos permisos.",
      "Clasificá cada observación en 'permiso', 'uso observado' o 'dato retenido', nunca mezcles categorías."
    ],
    "command": "$pages=@(\n 'ms-settings:privacy-microphone','ms-settings:privacy-webcam',\n 'ms-settings:privacy-location','ms-settings:privacy-feedback')\n$pages | % { Write-Output \"Panel autorizado: $_\" }\nGet-ComputerInfo | select WindowsVersion,OsBuildNumber",
    "evidence": "Matriz de superficie, no una declaración de ausencia de espionaje. Algunos paneles varían según versión.",
    "pitfall": "No llames evidencia de uso real a un permiso concedido; una lista vacía no permite reconstruir actividad histórica.",
    "action": "Retirá permisos únicamente a apps que no los justifican, con vuelta atrás documentada.",
    "recovery": "Dejá configuración anterior si una función se rompe; el script no cambia nada.",
    "challenge": "Elegí cinco capacidades y formulá una pregunta comprobable para cada una.",
    "references": [
      {
        "name": "Privacy settings",
        "url": "https://support.microsoft.com/en-us/windows/windows-privacy-settings"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 17,
    "discovery": "Una sesión extraña, proceso sin ruta fiable o persistencia desconocida puede exigir investigar, pero ninguna señal aislada autoriza concluir que hay un intruso.",
    "mechanism": "Los eventos de seguridad, tareas y cuentas ofrecen piezas distintas. Winlogon, conexiones RDP y servicios crean sesiones legítimas además del inicio humano en el escritorio.",
    "preparation": "Solo PC propia o autorizada. Evitá publicar nombres de cuentas, IP y rutas completas.",
    "experiment": [
      "Enumerá sesiones actuales y horas de inicio.",
      "Buscá inicios de sesión recientes si hay registro de seguridad disponible.",
      "Si hay un evento inesperado, correlacioná LogonType y cuenta, no sólo hora."
    ],
    "command": "quser\nGet-WinEvent -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 20 -ErrorAction SilentlyContinue |\n select TimeCreated,Id,MachineName",
    "evidence": "4624 indica autenticación exitosa con distintos tipos, no necesariamente un usuario sentado frente a la PC.",
    "pitfall": "Requiere directiva de auditoría y permisos adecuados; la ausencia de eventos no equivale a seguridad probada.",
    "action": "Si hay evidencia sólida de acceso no autorizado, aislá el equipo de forma planificada, conservá logs y cambiá credenciales desde dispositivo confiable.",
    "recovery": "Solo lectura.",
    "challenge": "Compará al menos dos tipos de logon legítimo y explicá la diferencia.",
    "references": [
      {
        "name": "Event 4624",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 18,
    "discovery": "El evento 4624 de Windows registra muchos inicios exitosos que NO son sesiones interactivas. LogonType cambia por completo la interpretación.",
    "mechanism": "LogonType=2 suele indicar inicio interactivo local, 3 inicio de red, 4 batch, 5 servicio y 10 acceso remoto interactivo. Eventos 4625 documentan intentos fallidos cuando corresponde.",
    "preparation": "Consultá exclusivamente tus registros; necesitás permisos y auditoría activa. No exportes datos personales del Security log.",
    "experiment": [
      "Consultá eventos recientes 4624 y 4625 con usuario administrador si corresponde.",
      "Inspeccioná XML de un solo evento para el campo LogonType.",
      "Compará hora con la sesión real y con tareas automatizadas; marca hipótesis no resueltas."
    ],
    "command": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624,4625;StartTime=(Get-Date).AddDays(-2)} -MaxEvents 30 -ErrorAction SilentlyContinue |\n % { $x=[xml]$_.ToXml();$lt=$x.Event.EventData.Data|?{$_.Name -eq 'LogonType'}\n [pscustomobject]@{Hora=$_.TimeCreated;Id=$_.Id;LogonType=$lt.'#text'} }",
    "evidence": "El XML permite distinguir autenticación del sistema y entrada interactiva. Un registro truncado no demuestra ausencia de actividad.",
    "pitfall": "Un 4624 a las 03:00 puede corresponder a un servicio; no publiques acusaciones ni identificación de personas por ese dato.",
    "action": "Correlacioná con logon 4634, proceso y política de auditoría antes de escalar un incidente.",
    "recovery": "Solo consulta, sin limpieza de eventos.",
    "challenge": "Explicá por qué LogonType 3 no equivale a alguien controlando el escritorio.",
    "references": [
      {
        "name": "Event 4624",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 19,
    "discovery": "Windows puede conservar cuentas locales deshabilitadas, cuentas de servicio y perfiles antiguos. La existencia de un nombre no significa que pueda iniciar sesión.",
    "mechanism": "La SAM local y la identidad Microsoft/Entra son ámbitos diferentes; grupos, estado Enabled y última conexión determinan exposición. Un perfil huérfano en Users no equivale a una cuenta activa.",
    "preparation": "No elimines cuentas ni contraseñas. Anotá la edición (Windows Home/Pro) y si el equipo pertenece a un dominio.",
    "experiment": [
      "Enumerá cuentas locales y estado habilitado/deshabilitado.",
      "Consultá miembros de administradores por SID en lo posible.",
      "Distingí cuenta activa, perfil sin uso y cuenta técnica del sistema."
    ],
    "command": "Get-LocalUser -ErrorAction SilentlyContinue |\n select Name,Enabled,LastLogon,PasswordRequired\nGet-CimInstance Win32_UserProfile -ErrorAction SilentlyContinue |\n select LocalPath,LastUseTime,Loaded,Special",
    "evidence": "Podés encontrar perfiles que no representan usuarios activos. LastLogon puede faltar o ser irrelevante en cuentas de servicios.",
    "pitfall": "No borres un perfil ni usuario porque 'parece viejo': algunos mantienen licencias, datos o tareas.",
    "action": "Documentá cuentas desconocidas y preguntá por su origen; sólo con respaldo considerar deshabilitarlas mediante procedimientos oficiales.",
    "recovery": "Laboratorio sin cambios.",
    "challenge": "Diferenciá tres cuentas técnicas de una cuenta humana sin consultar contraseñas.",
    "references": [
      {
        "name": "Get-LocalUser",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localuser"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 20,
    "discovery": "La cuenta que se llama 'usuario' puede tener más privilegios de los necesarios; pertenencia al grupo Administradores y token elevado son aspectos distintos.",
    "mechanism": "El grupo Administradores local da capacidad de elevación; UAC y tokens distinguen procesos elevados de sesiones corrientes. Los nombres de grupo se localizan por idioma, los SID son más fiables.",
    "preparation": "No agregues ni quites administradores durante la revisión. Anotá las cuentas que reconocés.",
    "experiment": [
      "Localizá grupo Administradores por SID conocido.",
      "Listá miembros, distinguiendo cuentas y grupos anidados.",
      "Separá pertenencia al grupo de si la terminal concreta está elevada."
    ],
    "command": "$grp=Get-LocalGroup -SID 'S-1-5-32-544' -ErrorAction SilentlyContinue\nif($grp){Get-LocalGroupMember -Group $grp.Name -ErrorAction SilentlyContinue |\n select Name,ObjectClass,PrincipalSource}\nwhoami /groups",
    "evidence": "El grupo puede contener usuarios o grupos, y algunas identidades pueden no resolverse sin red. 'Administrador' escrito en UI no informa UAC del proceso.",
    "pitfall": "No confundas privilegios instalados con uso malicioso. No saques miembros integrados por intuición.",
    "action": "Reducí privilegios excesivos sólo con respaldo y cuenta administrativa de recuperación comprobada.",
    "recovery": "Solo consulta, sin mutaciones.",
    "challenge": "Explicá por qué un miembro de Administradores puede ejecutar una consola no elevada.",
    "references": [
      {
        "name": "Get-LocalGroupMember",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localgroupmember"
      }
    ],
    "reviewStatus": "lab-verificable"
  }
];
