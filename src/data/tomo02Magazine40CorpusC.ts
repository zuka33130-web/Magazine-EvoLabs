import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';
/** Seguridad local y primer rendimiento · 018–025. */
export const EVO_WINDOWS40_CORPUS_C: EvoWindowsResearch[] = [
  {
    "number": 18,
    "premise": [
      "Una sesión iniciada fuera de horario puede ser un dato significativo, pero también puede provenir de una tarea de servicio, recurso compartido o autenticación de red. El desafío es reconstruir quién se autenticó, desde qué contexto y si esa sesión fue realmente interactiva. Una sola marca de hora en una ventana de seguridad no confirma un acceso al escritorio.",
      "El expediente introduce un protocolo de correlación de eventos de Windows, cuentas y tipos de inicio. No pretende descubrir al culpable por una captura: busca obtener una cronología que otra persona pueda auditar."
    ],
    "mechanisms": [
      "En los eventos de seguridad, 4624 registra una autenticación satisfactoria y 4625 un intento fallido si las directivas de auditoría lo permiten. El LogonType distingue, entre otros, inicio interactivo local (2), red (3), lote (4), servicio (5) y remoto interactivo (10). La semántica exacta exige revisar los campos de cada evento y el sistema que lo produjo.",
      "Las sesiones pueden implicar cuentas de máquina, identidades de servicio y autenticación en segundo plano. Un mismo usuario puede tener varios Logon IDs o renovar credenciales. No confundas 'autenticó un principal' con 'alguien vio el escritorio'."
    ],
    "traps": [
      "La hora mostrada en una captura sin zona horaria puede alterar toda la cronología. Eventos retenidos parcialmente, relojes desincronizados o una política que no audita todas las categorías generan huecos. La ausencia de 4624 no prueba ausencia de acceso.",
      "Publicar nombres de usuario, direcciones IP internas o dominios reales como ejemplo de internet expone información que no ayuda a enseñar. Para un tutorial, siempre anonimizá. Y nunca cierres una investigación filtrando solo los eventos que respaldan tu teoría."
    ],
    "protocol": [
      "Registrá la hora de una sesión interactiva propia, bloqueá y desbloqueá una vez el equipo para comparar eventos si tu sistema conserva la auditoría necesaria. Tomá una muestra de 4624 y 4625 dentro de una ventana breve y documentá los tipos registrados. No ingreses contraseñas erróneas para fabricar fallos.",
      "Para una sospecha histórica, comenzá con intervalo, cuenta y máquina. Comprobá el LogonType y, si existe, dirección origen y Logon ID. Relacioná con 4634/4647 cuando estén disponibles, y con registros de sesión remota si corresponde."
    ],
    "interpretation": [
      "Un 4624 tipo 3 a las 03:17 puede indicar autenticación de red; no demuestra que alguien movió el mouse. Un 4624 tipo 10 merece comprobar contexto de acceso remoto, pero tampoco atribuye intenciones por sí solo. La interpretación requiere identidad, origen autorizado y acciones.",
      "Cuando una sesión aparece fuera de horario, primero buscá si la cuenta era un servicio, una tarea o una persona. Una coincidencia temporal es una pista. Evidencia más fuerte exige acciones posteriores y credenciales vinculadas."
    ],
    "conclusion": [
      "La habilidad que se lleva el lector es leer un evento completo. Los IDs no son titulares, son registros con campos que hay que interpretar. Si una sospecha se sostiene, el siguiente paso es preservar evidencia y determinar alcance sin alterar el sistema.",
      "Un buen informe de accesos siempre indica cobertura de auditoría, zona horaria y huecos conocidos. La incertidumbre expresada correctamente es una señal de profesionalismo."
    ],
    "lab": {
      "title": "LAB 018 · TIPOS DE INICIO",
      "why": "Consultá eventos de sesión propios; puede requerir elevación para acceder al registro Security.",
      "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624,4625;StartTime=(Get-Date).AddDays(-2)} -MaxEvents 30 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName,Message\nwhoami /user",
      "readout": "Buscá LogonType en los detalles y comprobá identidad/contexto. Los eventos 4624/4625 describen autenticación, no actividad de escritorio por sí solos."
    },
    "insight": "Evento de autenticación no equivale automáticamente a persona operando el escritorio.",
    "challenge": "Anotá un inicio propio, buscá su evento y explicá por qué el tipo de logon importa más que la hora aislada.",
    "video": "¿Alguien inició sesión de noche? El dato decisivo no es la hora: es el tipo de acceso.",
    "sources": [
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Evento 4624 de Windows — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624"
      },
      {
        "name": "Evento 4625 de Windows — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625"
      }
    ]
  },
  {
    "number": 19,
    "premise": [
      "Una cuenta local olvidada puede conservar privilegios aunque nadie la use desde hace meses. En otros casos, una identidad desconocida es un componente de servicio o un usuario creado por una instalación legítima. La cuestión no es borrar toda cuenta que no reconocés, sino determinar quién puede iniciar sesión, qué grupos integra y cómo se administra su ciclo de vida.",
      "El informe transforma la lista de usuarios en un mapa de exposición: habilitación, autenticación, pertenencia a grupos, estado de contraseña y propósito. Toda recomendación exige comprobar dependencias y un método seguro de retorno."
    ],
    "mechanisms": [
      "Windows separa usuarios locales, cuentas Microsoft vinculadas, principales de dominio y servicios. Un usuario puede estar habilitado, pero tener restricciones de inicio o pertenecer a un grupo que no otorga administración. Las cuentas integradas tienen roles específicos y su exposición depende de configuración.",
      "Get-LocalUser muestra identidad local y estado; Get-LocalGroupMember aporta pertenencia. En equipos unidos a dominio, identidades externas y GPO cambian el análisis. El SID identifica a un principal de forma más persistente que el nombre visible, que puede cambiar."
    ],
    "traps": [
      "'Nunca inició sesión' no es sinónimo de 'nadie puede usarla': las marcas disponibles pueden ser incompletas o corresponder a un tipo de inicio distinto. El grupo Users no equivale a Administrators, y tener una cuenta deshabilitada no prueba que sus archivos estén seguros.",
      "Borrar usuarios o carpetas antes de documentar puede destruir perfiles, claves, credenciales de servicio y acceso a datos. Este laboratorio se queda en consultas y clasificación."
    ],
    "protocol": [
      "Inventariá usuarios locales y grupos relevantes. Para cada identidad, anotá habilitado, SID, tipo, pertenencia y propósito conocido. Si una cuenta no resulta familiar, buscá primero el software o administrador que la creó, documentación y fecha de instalación.",
      "En un equipo personal revisá si hay cuentas que ya no necesitás, pero no cambies nada sin asegurar recuperación. En un entorno administrado separá claramente autoridades de dominio y políticas locales; un usuario no controla necesariamente todas las decisiones."
    ],
    "interpretation": [
      "Una cuenta habilitada y miembro de Administradores representa una superficie importante; eso no demuestra que se haya usado recientemente. Correlacioná con 4624 y cambios de cuenta si esos eventos existen. Un nombre raro sin privilegios puede ser un componente de servicio.",
      "El peligro real depende de credenciales, permisos, posibilidad de inicio y exposición de servicios. No existe una fórmula 'más de tres cuentas = infección'."
    ],
    "conclusion": [
      "El lector se lleva una tabla de identidades con sentido: SID, función, habilitación y privilegio. Esa tabla es un documento de seguridad que permite decidir con información y no con alarma.",
      "La pregunta final no es cuántos usuarios existen, sino qué rutas de acceso autorizadas tienen y quién controla esas autorizaciones."
    ],
    "lab": {
      "title": "LAB 019 · IDENTIDADES LOCALES",
      "why": "Auditoría de solo lectura de usuarios y pertenencias.",
      "code": "Get-LocalUser | Select-Object Name,Enabled,SID,LastLogon,PasswordRequired\nGet-LocalGroupMember -Group Administrators -ErrorAction SilentlyContinue | Select-Object Name,ObjectClass,PrincipalSource",
      "readout": "Algunas cuentas externas no aparecen igual que cuentas locales. No borres ni deshabilites usuarios con el único criterio de que no reconocés su nombre."
    },
    "insight": "Una cuenta desconocida exige contexto de origen y privilegios; no es evidencia de intrusión por sí sola.",
    "challenge": "Identificá todas las cuentas habilitadas y explicá qué significa su pertenencia a grupos sin revelar identidades reales.",
    "video": "Hay cuentas que olvidaste. La pregunta no es cuántas: es cuáles pueden entrar.",
    "sources": [
      {
        "name": "Get-LocalUser — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localuser"
      },
      {
        "name": "Get-LocalGroupMember — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localgroupmember"
      },
      {
        "name": "Evento 4624 de Windows — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624"
      }
    ]
  },
  {
    "number": 20,
    "premise": [
      "Un programa solicita 'Ejecutar como administrador' y aparece UAC. Muchos usuarios creen que aceptar equivale a darle permiso absoluto para todo el sistema, o que un usuario que pertenece a Administradores siempre trabaja elevado. Ambas simplificaciones esconden cómo Windows usa tokens y elevación.",
      "Esta investigación construye un mapa práctico de privilegios: usuario, grupos, token actual, nivel de integridad y permisos efectivos sobre objetos. Conocer las fronteras permite evitar tanto el miedo injustificado como instalar software no confiable con privilegios innecesarios."
    ],
    "mechanisms": [
      "La pertenencia al grupo Administradores y el token de ejecución de un proceso no son lo mismo. UAC puede crear un contexto estándar para tareas habituales y solicitar elevación al realizar cambios privilegiados; el comportamiento depende de políticas y tipo de cuenta. Los objetos de Windows también tienen listas de control de acceso y propietarios.",
      "Un proceso elevado conserva limitaciones de kernel, controladores y protección del sistema. Algunas operaciones exigen privilegios específicos además de la pertenencia al grupo. Un programa que lanza un hijo puede transmitir contexto de seguridad, por lo que la cadena de procesos importa."
    ],
    "traps": [
      "'Soy administrador' no garantiza acceso a todos los archivos ni capacidad de modificar cualquier proceso protegido. Tampoco 'se abrió una ventana UAC' demuestra que el instalador sea seguro: UAC confirma elevación solicitada, no la reputación de la aplicación.",
      "Desactivar UAC para evitar mensajes reduce barreras sin probar rendimiento alguno. La auditoría de privilegios debe describir las operaciones que realmente requieren elevación y qué riesgo introducen."
    ],
    "protocol": [
      "Consultá identidad, grupos y privilegios del token actual con whoami, comparando —si tenés autorización y entendés el contexto— una consola estándar y otra elevada. Documentá qué cambia en la salida y qué no. No es necesario ejecutar herramientas que modifiquen configuración.",
      "Revisá administradores locales y distinguí grupos heredados o de dominio. Para un archivo de prueba propio, podés consultar permisos con Get-Acl; no tomes posesión ni cambies ACL durante el laboratorio."
    ],
    "interpretation": [
      "El token muestra grupos que pueden estar habilitados o marcados como solo denegar en determinados contextos. Por eso una lista de grupos sin atributos puede engañar. Una consola elevada no significa que el programa sea confiable ni que todos sus hijos deban ejecutarse igual.",
      "La seguridad real depende de principio de mínimo privilegio, procedencia del software, aislamiento y políticas. El experimento no debe buscar 'romper protecciones' sino entenderlas."
    ],
    "conclusion": [
      "Ahora podés explicar por qué dos ventanas PowerShell ejecutadas por la misma persona tienen capacidades diferentes. Es un resultado aplicable a instalaciones, diagnóstico y análisis de malware sin modificar barreras de seguridad.",
      "El mejor ajuste de privilegios no es otorgarlos siempre: es disponer de ellos solo cuando una operación legítima los necesita y saber comprobar ese hecho."
    ],
    "lab": {
      "title": "LAB 020 · TOKEN Y GRUPOS",
      "why": "Consulta la identidad y privilegios actuales, sin elevar automáticamente.",
      "code": "whoami /user\nwhoami /groups\nwhoami /priv\nGet-LocalGroupMember -Group Administrators -ErrorAction SilentlyContinue | Select-Object Name,ObjectClass",
      "readout": "Buscá grupos habilitados o restringidos y privilegios del token. La pertenencia a Administradores no es un certificado de confianza de software."
    },
    "insight": "Privilegio asignado, token elevado y acceso efectivo son tres cosas diferentes.",
    "challenge": "Compará de forma voluntaria whoami /groups entre consola estándar y elevada sin hacer cambios.",
    "video": "Ser administrador no significa estar elevado siempre. Windows tiene más de una frontera.",
    "sources": [
      {
        "name": "Get-LocalGroupMember — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localgroupmember"
      },
      {
        "name": "Get-LocalUser — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localuser"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ]
  },
  {
    "number": 21,
    "premise": [
      "Una opción de escritorio remoto, un servicio de asistencia o un programa de acceso remoto instalado pueden abrir una vía legítima de administración. Pero 'habilitado' tampoco equivale a 'alguien está conectado'. El misterio exige comprobar tres capas: configuración de servicio, escucha de red y sesión realmente establecida.",
      "El objetivo es auditar superficies sin habilitar acceso remoto para probarlas. No hace falta abrir puertos ni instalar controladores; basta construir una fotografía de políticas, procesos y conectividad."
    ],
    "mechanisms": [
      "Remote Desktop Services, Asistencia rápida, WinRM y software de terceros son tecnologías distintas. RDP depende de edición, configuración, firewall, cuentas autorizadas y políticas. Un puerto TCP 3389 escuchando puede ser una pista de servicio, pero su ausencia no cubre aplicaciones que usan otros puertos o túneles salientes.",
      "Una conexión TCP ESTABLISHED con un proceso de asistencia tampoco confirma que esté mostrando el escritorio. El protocolo puede negociar señales, mantener sesiones o usar intermediarios. Para verificar acceso real hacen falta autenticación, sesiones y logs del producto."
    ],
    "traps": [
      "Desactivar un servicio porque el nombre contiene 'remote' puede interrumpir administración necesaria. Del mismo modo no habilites RDP con la excusa de 'verificar si funciona': transformarías la superficie investigada.",
      "Un análisis basado solo en 3389 ignora alternativas legítimas y herramientas de terceros. Un firewall abierto no significa que alguien atravesó el control de autenticación."
    ],
    "protocol": [
      "Consultá configuración de Remote Desktop sin modificarla, estado de servicios asociados y reglas de firewall de ese grupo si existen. Registrá escucha de red y conexiones activas; después buscá sesiones remotas en eventos si hay evidencia que lo justifique.",
      "Para software de asistencia de terceros, inventariá programas instalados y procesos de firma conocida. Documentá qué producto utiliza acceso desatendido y cuál exige consentimiento del usuario. No publiques códigos de sesión ni tokens."
    ],
    "interpretation": [
      "La combinación 'RDP habilitado + escucha TCP + cuenta autorizada' describe superficie, no intrusión. Un evento de autenticación remoto en un horario inesperado requiere investigación y puede aumentar la sospecha. Si el equipo está detrás de NAT, su exposición externa es otra cuestión independiente.",
      "Las políticas administradas pueden contradecir un valor aislado del Registro. Confirmá siempre edición, GPO y contexto antes de emitir recomendaciones."
    ],
    "conclusion": [
      "El lector se lleva una lista de superficies con tres estados separados: configurado, disponible y utilizado. Esa distinción cambia la calidad de cualquier informe de acceso remoto.",
      "Un hallazgo de riesgo se expresa con evidencias y escenarios de ataque plausibles, no con una alarma automática por detectar un puerto."
    ],
    "lab": {
      "title": "LAB 021 · EXPOSICIÓN REMOTA",
      "why": "Inspección de RDP, servicios y conexiones sin habilitar acceso.",
      "code": "Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server' -ErrorAction SilentlyContinue | Select-Object fDenyTSConnections\nGet-Service TermService,WinRM -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType\nGet-NetTCPConnection -LocalPort 3389 -ErrorAction SilentlyContinue | Select-Object State,LocalAddress,RemoteAddress,OwningProcess",
      "readout": "fDenyTSConnections=0 puede habilitar RDP en ediciones compatibles, pero no prueba escucha, exposición exterior ni sesiones. WinRM y apps de terceros requieren auditorías separadas."
    },
    "insight": "Configurado, escuchando y utilizado no son sinónimos.",
    "challenge": "Elaborá una matriz de RDP, WinRM y una herramienta remota propia si existe; anotá lo que no podés deducir.",
    "video": "¿Tenés acceso remoto abierto? Un puerto no basta para conocer la respuesta.",
    "sources": [
      {
        "name": "Get-NetTCPConnection — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      },
      {
        "name": "Get-NetFirewallRule — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/netsecurity/get-netfirewallrule"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      }
    ]
  },
  {
    "number": 22,
    "premise": [
      "Encontrás un proceso llamado svchost.exe en una carpeta de descargas y pensás que es normal porque Windows usa ese nombre. O ves un archivo legítimo de System32 y asumís que es peligroso por consumir CPU. Ambos extremos fracasan: el nombre del ejecutable no certifica identidad ni malicia.",
      "El expediente enseña verificación de procedencia a través de ruta, firma digital, hash, árbol de procesos y comportamiento. Ningún indicador aislado sustituye a los demás: un proceso puede estar firmado y seguir siendo abusado, o carecer de firma sin ser malware."
    ],
    "mechanisms": [
      "Windows ejecuta archivos de sistema firmados y aplicaciones legítimas con distintas rutas y editores. Authenticode verifica si la firma criptográfica corresponde al archivo y si puede establecerse confianza en la cadena bajo condiciones locales; no promete que el software esté libre de vulnerabilidades o funciones indeseadas.",
      "Los hashes identifican contenido binario: dos archivos con mismo nombre y hash diferente no son idénticos, pero tampoco uno es malicioso por diferir. Los ejecutables se pueden ubicar en rutas inusuales por empaquetados, portabilidad y entornos corporativos."
    ],
    "traps": [
      "'Firmado por Microsoft' no es una prueba absoluta de seguridad en ejecución, y 'sin firma' no significa automáticamente troyano. La fecha, reputación, procedencia y actividad son variables complementarias. Un nombre clon puede intentar engañar, pero el veredicto requiere contexto.",
      "Suspender procesos del sistema en vivo para investigarlos puede hacer perder datos y bloquear servicios; si hay sospecha real, preservá evidencias y pedí ayuda si necesitás actuar. Este laboratorio no ejecuta ni mueve archivos desconocidos."
    ],
    "protocol": [
      "Elegí dos ejecutables conocidos y autorizados; consultá ruta, firma y hash. Después correlacioná con PID y hora de inicio. Si investigás un proceso desconocido, no lo abras desde una carpeta sospechosa: inspeccioná metadatos de forma pasiva y con herramientas confiables.",
      "Anotá nombre, PID, ruta completa, editor, firma, hash y proceso padre si es posible. Revisá si la aplicación pertenece a un paquete instalado o es un binario portátil legítimo. No subas archivos personales a servicios públicos sin autorización."
    ],
    "interpretation": [
      "Un estado de firma válido solo se refiere a integridad y validación respecto de una firma; no caracteriza toda la conducta. La firma inválida puede indicar archivo modificado, problemas de cadena o certificados y requiere detalle técnico adicional.",
      "El hash sirve para comparaciones con muestras de referencia bajo control; un valor SHA-256 aislado carece de significado de seguridad. La relación de procesos ayuda, pero la atribución temporal puede fallar si el padre ya finalizó."
    ],
    "conclusion": [
      "La habilidad real es levantar un expediente de identidad de procesos, no coleccionar capturas de nombres extraños. Esa metodología separa suplantación posible de comportamiento benigno verificable.",
      "La conclusión nunca se formula 'virus detectado por nombre' y nunca se recomienda borrar System32 como procedimiento universal. Primero se analiza, después se actúa."
    ],
    "lab": {
      "title": "LAB 022 · RUTA, FIRMA Y HASH",
      "why": "Usá un ejecutable conocido del sistema; no abras archivos sospechosos.",
      "code": "$path=Join-Path $env:WINDIR 'System32\\notepad.exe'\nGet-Item $path | Select-Object FullName,Length,LastWriteTime\nGet-AuthenticodeSignature -FilePath $path | Select-Object Status,StatusMessage,SignerCertificate\nGet-FileHash -Path $path -Algorithm SHA256 | Select-Object Algorithm,Hash",
      "readout": "Un hash no indica por sí solo malware. Status=Valid indica un estado de firma, no garantía de buen comportamiento. Usá una ruta de archivo que realmente exista."
    },
    "insight": "Nombre, ruta, firma y hash son evidencias diferentes. Ninguna sola decide si un proceso es confiable.",
    "challenge": "Armá dos fichas de ejecutables conocidos; explicá por qué un nombre familiar puede ser imitado sin descargar malware.",
    "video": "Un archivo puede llamarse Windows y no ser Windows. Probá identidad, no etiquetas.",
    "sources": [
      {
        "name": "Get-AuthenticodeSignature — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature"
      },
      {
        "name": "Get-FileHash — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash"
      },
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ]
  },
  {
    "number": 23,
    "premise": [
      "Después de una sospecha aparecen decenas de eventos de seguridad. ¿Cuáles muestran una actividad peligrosa y cuáles son ruido de fondo? Un reporte que destaque el código de evento más alarmante sin reconstruir el contexto corre riesgo de inventar un incidente. La habilidad forense consiste en concatenar identidad, acción y tiempo.",
      "El artículo usa eventos de autenticación y cambios de cuenta como piezas que pueden relacionarse con un acceso. Nada de escanear máquinas ajenas; el método se aplica al propio equipo o a una auditoría autorizada."
    ],
    "mechanisms": [
      "Los eventos 4624/4625 cubren autenticación exitosa y fallida cuando se audita esa categoría. Otros eventos, según las políticas habilitadas, pueden describir creación de cuentas (4720), cambios de grupos (4732) o ejecución de procesos (4688). Su disponibilidad y detalle varían entre ediciones, directivas y retención.",
      "El origen, SID, Logon ID, nombre de cuenta, tipo de inicio y hora precisan una secuencia. Varios eventos de un mismo minuto no pertenecen automáticamente a una sola sesión. Se necesita correlacionar identificadores y comprender la relación temporal."
    ],
    "traps": [
      "Contar fallos 4625 y asumir 'ataque' ignora intentos de contraseñas desactualizadas, servicios con credenciales viejas o usuarios que se equivocaron. A la inversa, ningún fallo registrado no excluye que una credencial válida haya sido utilizada.",
      "El 4688 puede no registrar línea de comandos o puede no existir si la auditoría de creación de procesos está desactivada. No lo fuerces en el laboratorio, porque cambiar políticas alteraría el sistema analizado."
    ],
    "protocol": [
      "Elegí un día y buscá los eventos disponibles entre los códigos seleccionados. Agrupá por tiempo y, dentro de cada registro, anotá proveedor, ID, cuenta y detalles pertinentes sin publicar datos sensibles. No conviertas la salida completa en una lista de nombres de atacantes.",
      "Seleccioná una línea de tiempo que puedas explicar: autenticación, posible ejecución, cambio de cuenta y salida de sesión. Si falta una pieza, indicá 'no registrado' y qué otra fuente podrías consultar, como historial de tareas o registros del software usado."
    ],
    "interpretation": [
      "Un cambio de grupo registrado cerca de un logon puede ser relevante, pero requiere comprobar qué cuenta fue agregada, quién realizó el cambio y si estaba autorizado. Los procesos de sistema pueden generar múltiples eventos legítimos de igual forma.",
      "El diagnóstico profesional no oculta excepciones: distingue evento confirmado, interpretación plausible y prueba ausente. Las retenciones de log y reloj acotan las conclusiones."
    ],
    "conclusion": [
      "EVO LABS transforma miles de registros en una línea de tiempo comprensible con cuatro columnas: cuándo, quién, qué y evidencia. El método permite que otro investigador revise tus pasos sin confiar en una captura seleccionada.",
      "Si la evidencia sugiere intrusión real, el siguiente paso no es una 'limpieza' casera que borra huellas: es preservar registros, proteger cuentas desde canales confiables y buscar respuesta especializada."
    ],
    "lab": {
      "title": "LAB 023 · SECUENCIA DE SEGURIDAD",
      "why": "Consulta eventos disponibles de tu propio equipo; puede requerir administrador.",
      "code": "$ids=4624,4625,4688,4720,4732\nGet-WinEvent -FilterHashtable @{LogName='Security';Id=$ids;StartTime=(Get-Date).AddDays(-2)} -MaxEvents 50 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName,Message",
      "readout": "Los IDs pueden faltar según la política de auditoría. No confundas cantidad de eventos con severidad; cada uno exige examen de sus campos."
    },
    "insight": "El ID de evento adquiere sentido junto a proveedor, cuenta, tipo de acción y contexto temporal.",
    "challenge": "Seleccioná tres eventos y explicá qué secuencia justifican y qué parte es solo una hipótesis.",
    "video": "Los logs de Windows pueden revelar un acceso, pero un ID rojo no cuenta toda la historia.",
    "sources": [
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Evento 4624 de Windows — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624"
      },
      {
        "name": "Evento 4625 de Windows — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625"
      }
    ]
  },
  {
    "number": 24,
    "premise": [
      "Descargás un instalador aparentemente legítimo y Windows avisa que su editor no se pudo verificar. ¿Lo ejecutás? Antes de responder, hay que separar firma criptográfica, procedencia, reputación, integridad y autorización del usuario. Un archivo firmado puede ser dañino, y uno sin firma puede ser software legítimo hecho por un desarrollador pequeño.",
      "Este expediente permite tomar decisiones sin ejecutar una muestra sospechosa. Usaremos un archivo conocido y confiable para comprobar el método y explicaremos qué preguntas siguen abiertas ante cualquier instalador recibido de Internet."
    ],
    "mechanisms": [
      "Authenticode permite verificar firmas que vinculan contenido con un certificado, y la cadena de confianza permite evaluar su validación según las autoridades y condiciones del sistema. El resultado depende también de marca de tiempo, revocación cuando puede consultarse y validez del certificado.",
      "La zona de origen de Internet y SmartScreen/reputación ofrecen señales adicionales pero diferentes. Una alerta de reputación puede deberse a poca prevalencia y no equivale por sí sola a infección; la ausencia de advertencia tampoco garantiza seguridad."
    ],
    "traps": [
      "Comparar el hash con un valor 'encontrado en Google' no sirve si la fuente no es oficial o está desactualizada. Firmas y hashes pueden ser correctos para una versión y cambiar después de un update legítimo.",
      "Subir instaladores privados o software empresarial a escáneres públicos puede violar acuerdos o compartir datos sensibles. La investigación prefiere origen oficial, comprobación local y políticas de seguridad antes que curiosidad invasiva."
    ],
    "protocol": [
      "Elegí un ejecutable de Windows cuya ruta conozcas y examiná su firma y hash. Visitá la página oficial del proveedor para entender cómo publica instaladores y si ofrece checksums. No descargues ni abras muestras maliciosas.",
      "Ante un instalador real, registrá URL del proveedor, versión, tamaño, firma, editor e información de reputación si el sistema la ofrece. La decisión de ejecutar también depende de necesidad, permisos solicitados y entorno aislado."
    ],
    "interpretation": [
      "Status=Valid indica que la comprobación de firma consiguió validar lo necesario localmente; no prueba que el programa no registre datos, tenga vulnerabilidades o respete tus expectativas de privacidad. La confianza es una decisión con múltiples señales.",
      "Si la firma aparece inválida, no concluís automáticamente malware: investigá causa, origen y condiciones de validación. Un expediente bien hecho no elimina alertas por presión del marketing."
    ],
    "conclusion": [
      "El resultado es una lista de verificación para instalaciones: origen, firma, hash oficial, permisos, reputación y reversión. Evitar ejecutar algo dudoso es una medida más poderosa que intentar desinfectarlo después.",
      "El lector puede enseñar a otra persona a decir 'no sé todavía' antes de pulsar Ejecutar. Esa prudencia es técnica, no miedo."
    ],
    "lab": {
      "title": "LAB 024 · INSTALADOR EN MODO LECTURA",
      "why": "Verifica un ejecutable confiable instalado; no ejecuta instaladores descargados.",
      "code": "$sample=Join-Path $env:WINDIR 'System32\\notepad.exe'\nGet-AuthenticodeSignature $sample | Select-Object Status,StatusMessage,SignerCertificate\nGet-FileHash $sample -Algorithm SHA256 | Select-Object Hash",
      "readout": "Firma y hash se refieren al archivo presente. Contrastá versiones con documentación oficial; no pegues un checksum de origen dudoso para justificar la instalación."
    },
    "insight": "Una firma válida autentica un vínculo criptográfico; no certifica inocuidad ni ética del programa.",
    "challenge": "Comprobá un ejecutable conocido y diseñá una política de revisión para futuros instaladores.",
    "video": "¿Confiás en un instalador porque tiene icono conocido? Verificá cadena, hash y origen.",
    "sources": [
      {
        "name": "Get-AuthenticodeSignature — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature"
      },
      {
        "name": "Get-FileHash — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash"
      }
    ]
  },
  {
    "number": 25,
    "premise": [
      "El Administrador de tareas marca CPU al 100 % y una aplicación tarda segundos en responder. El número parece concluyente, pero podría ser saturación de un único procesador lógico, interrupciones, trabajo de kernel, procesos con prioridades distintas o carga de otro usuario. No todas las cifras de 'CPU alta' miden el mismo intervalo ni la misma capacidad.",
      "El artículo obliga a pasar del porcentaje al mecanismo: cola de hilos listos, consumo de tiempo en usuario/kernel, procesos que despiertan repetidamente y relación con latencias observables. No vamos a desactivar servicios para ver desaparecer una barra."
    ],
    "mechanisms": [
      "Los núcleos y procesadores lógicos comparten recursos y frecuencias variables. Un proceso puede saturar un hilo con aproximadamente una fracción de la CPU total; otro puede repartir trabajo por varios núcleos. La afinidad, prioridades, límites térmicos y scheduler alteran la forma de utilización.",
      "Get-Process.CPU acumula segundos de ejecución y no muestra porcentaje instantáneo. Un intervalo ΔCPU dividido por Δtiempo y por procesadores lógicos da una aproximación a la cuota de capacidad lógica total. Esta cifra no identifica colas de ejecución ni frecuencias reales."
    ],
    "traps": [
      "Confundir 100 % de utilización con 100 % de rendimiento es un error: un CPU ocupado puede estar a frecuencia reducida por límites térmicos o potencia. También una app lenta puede estar esperando disco, red o GPU aunque la CPU global esté baja.",
      "Un proceso del sistema que exhibe CPU puede ejecutar tareas legítimas. Cerrarlo o alterar prioridades sin investigación puede perder datos o volver inestable la máquina. La meta no es producir un número bonito sino localizar la causa del síntoma."
    ],
    "protocol": [
      "Medí tres períodos de diez segundos con la misma carga. Tomá CPU total, tiempo acumulado de los procesos y duración real. Documentá qué app estaba abierta y el síntoma reproducible. Si aparecen procesos que terminan, anotá que la muestra no los capturó.",
      "Correlacioná con memoria disponible, E/S y temperatura cuando tengas instrumentos adecuados. Si el problema ocurre solo en un juego, medí frametime y resolución estable; bajar resolución puede desplazar un límite GPU hacia CPU y cambiar completamente el diagnóstico."
    ],
    "interpretation": [
      "Si un proceso ganó dos segundos de CPU en diez segundos en un equipo con diez procesadores lógicos, su uso medio aproximado de capacidad lógica fue 2 %. No confundas con el 20 % de un único lógico; sin definir denominador, el dato es ambiguo.",
      "Una lectura global alta con un proceso pequeño puede indicar carga distribuida, componentes del sistema o diferencias de muestreo. Usá herramientas complementarias antes de atribuirlo a una sola app."
    ],
    "conclusion": [
      "El usuario aprende a reemplazar el juicio basado en el 100 % por un experimento: reproducción, contador definido, intervalo, origen y correlación. Así puede distinguir carga real, limitación de frecuencia y espera de otros recursos.",
      "La herramienta de optimización más eficaz suele ser formular la pregunta exacta: ¿qué proceso o hilo está ocupando tiempo y qué operación lo hizo necesario?."
    ],
    "lab": {
      "title": "LAB 025 · CPU PROMEDIO POR PROCESO",
      "why": "Dos instantáneas de CPU acumulada; no cambia afinidad ni prioridades.",
      "code": "$n=[Environment]::ProcessorCount\n$a=@{}; Get-Process | Where-Object {$null -ne $_.CPU} | ForEach-Object {$a[$_.Id]=$_.CPU}\n$timer=[Diagnostics.Stopwatch]::StartNew(); Start-Sleep -Seconds 10; $timer.Stop()\nGet-Process | Where-Object {$null -ne $_.CPU -and $a.ContainsKey($_.Id)} | ForEach-Object { [pscustomobject]@{Nombre=$_.ProcessName;PID=$_.Id;PctAprox=[math]::Round((($_.CPU-$a[$_.Id])/$timer.Elapsed.TotalSeconds/$n)*100,2)} } | Sort-Object PctAprox -Descending | Select-Object -First 12",
      "readout": "Es una estimación con limitaciones por reciclaje de PID y procesos transitorios; no equivale a trazas ETW ni mide frecuencia del procesador."
    },
    "insight": "100 % de CPU es utilización, no prueba de máximo rendimiento ni identificación del culpable.",
    "challenge": "Tomá tres muestras comparables y describí qué proceso aparece consistente; cruzá con un síntoma real.",
    "video": "CPU al 100 %. ¿Quién la usa? El nombre que ves puede no contar la historia.",
    "sources": [
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  }
];
