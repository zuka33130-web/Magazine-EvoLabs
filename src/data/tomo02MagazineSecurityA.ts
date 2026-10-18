import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Seguridad I · Investigaciones 076–087. Solo observación defensiva. */
export const EVO_MAGAZINE_SECURITY_A: EvoMagazineArticle[] = [
  {
    "id": 76,
    "goal": "Aprender a reconocer indicios de acceso no autorizado sin confundir actividad normal con una intrusión.",
    "basics": "Un equipo puede mantener cuentas locales, servicios y conexiones en segundo plano. La seguridad se investiga correlacionando identidades, sesiones, procesos y registros; un puerto abierto o una IP desconocida no prueban que haya una persona conectada.",
    "steps": [
      {
        "title": "Inventariá cuentas locales",
        "why": "Enumerá usuarios sin leer contraseñas ni modificar privilegios.",
        "code": "Get-LocalUser | Select-Object Name,Enabled,LastLogon",
        "expect": "Verás cuentas habilitadas o deshabilitadas; algunas pueden ser de sistema."
      },
      {
        "title": "Revisá conexiones actuales",
        "why": "Un socket TCP no permite saber por sí solo quién inició la conexión.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 20 OwningProcess,RemoteAddress,RemotePort",
        "expect": "Vas a ver conexiones de programas legítimos y posiblemente otras que requieren investigar."
      },
      {
        "title": "Comprobá registros recientes",
        "why": "Consultá eventos de seguridad de autenticación si tenés permisos.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddHours(-8)} -MaxEvents 8 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Puede haber accesos de servicio y de usuarios; el ID 4624 no significa ataque."
      }
    ],
    "tip": "Truco: comenzá por cuentas habilitadas y momentos inusuales, no por perseguir cualquier IP extranjera.",
    "warning": "Si encontrás indicios fuertes, preservá evidencia y cambiá credenciales desde un equipo confiable; no borres registros.",
    "challenge": "Identificá dos hechos verificables y dos que no podrías concluir sin más datos."
  },
  {
    "id": 77,
    "goal": "Examinar un ejecutable desconocido sin abrirlo ni eliminar archivos legítimos.",
    "basics": "Los nombres, iconos y carpetas se pueden imitar. Antes de confiar en un proceso evaluamos ubicación, editor, firma, ruta y contexto; incluso una firma válida no demuestra que el programa sea completamente seguro.",
    "steps": [
      {
        "title": "Enumerá procesos y sus rutas",
        "why": "CIM ofrece rutas cuando los permisos lo permiten.",
        "code": "Get-CimInstance Win32_Process | Select-Object -First 18 Name,ProcessId,ExecutablePath",
        "expect": "Algunos procesos no mostrarán ruta por protección; no implica que sean maliciosos."
      },
      {
        "title": "Verificá una firma conocida",
        "why": "Tomá como ejemplo una copia oficial de Windows, sin abrir ejecutables descargados.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object Status,SignerCertificate",
        "expect": "Puede mostrar una firma validada o un estado diferente; depende del archivo y de los certificados."
      },
      {
        "title": "Consultá archivos del sistema sin modificarlos",
        "why": "La existencia de una ruta ayuda a situar el análisis.",
        "code": "Get-Item (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object FullName,Length,LastWriteTime",
        "expect": "Verás metadatos; la fecha sola no indica compromiso."
      }
    ],
    "tip": "Truco: un archivo llamado svchost.exe fuera de ubicaciones legítimas merece investigación, no ejecución.",
    "warning": "No hagas doble clic en binarios sospechosos, ni elimines archivos protegidos por una alerta genérica.",
    "challenge": "Escribí cuatro verificaciones independientes que realizarías antes de clasificar un archivo."
  },
  {
    "id": 78,
    "goal": "Relacionar conexiones remotas con los procesos que realmente las mantienen.",
    "basics": "Internet utiliza numerosos servidores de contenido, certificados y actualización. Una dirección remota no es una persona, y un destino desconocido puede pertenecer a infraestructura legítima.",
    "steps": [
      {
        "title": "Mostrá destinos TCP",
        "why": "El listado es una instantánea de sesiones.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 25 RemoteAddress,RemotePort,OwningProcess",
        "expect": "Algunos IPs cambian entre consultas por conexiones breves."
      },
      {
        "title": "Identificá el proceso responsable",
        "why": "Reemplazá 1234 por un OwningProcess de la lista.",
        "code": "Get-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Name,Id,Path",
        "expect": "Obtendrás un nombre o nada si el proceso finalizó."
      },
      {
        "title": "Revisá puertos que escuchan",
        "why": "Diferenciá escuchar localmente de mantener una sesión remota.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress,LocalPort,OwningProcess",
        "expect": "No supone que el puerto esté expuesto a Internet."
      }
    ],
    "tip": "Truco: registrá fecha, destino y PID juntos: investigar solo una IP hace perder contexto.",
    "warning": "No atribuyas conducta ilícita a servidores compartidos ni bloquees redes completas sin diagnóstico.",
    "challenge": "Describí qué evidencia falta para afirmar que una conexión es maliciosa."
  },
  {
    "id": 79,
    "goal": "Distinguir qué es realmente una puerta trasera y cómo buscar indicadores.",
    "basics": "Una backdoor puede permitir accesos no previstos, pero no todo servicio remoto es una backdoor. La auditoría defensiva revisa cuentas, exposición, persistencia y autorizaciones sin realizar intrusiones.",
    "steps": [
      {
        "title": "Revisá puertos locales",
        "why": "Enumerá sockets en escucha sin enviar tráfico a terceros.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess",
        "expect": "Vas a encontrar puertos de servicios legítimos y aplicaciones."
      },
      {
        "title": "Consultá tareas de inicio",
        "why": "La persistencia puede usar tareas, pero su existencia es normal.",
        "code": "Get-ScheduledTask | Select-Object -First 20 TaskName,TaskPath,State",
        "expect": "Aparecerá un conjunto de tareas instaladas; ninguna es automáticamente sospechosa."
      },
      {
        "title": "Consultá cuentas locales",
        "why": "Las cuentas ocultas en la pantalla de inicio pueden seguir existiendo para servicios.",
        "code": "Get-LocalUser | Select-Object Name,Enabled",
        "expect": "La auditoría requiere conocer propósito y propietario de cada cuenta."
      }
    ],
    "tip": "Truco: una hipótesis de backdoor solo adquiere fuerza si hay indicios combinados de acceso y persistencia no autorizados.",
    "warning": "No deshabilites RDP, tareas o usuarios administrados sin evaluar dependencias y autorizaciones.",
    "challenge": "Planteá un plan de confirmación que descarte al menos tres explicaciones legítimas."
  },
  {
    "id": 80,
    "goal": "Revisar eventos de inicio de sesión y comprender sus límites.",
    "basics": "Windows distingue inicios de sesión interactivos, de red, de servicio y otros. Un evento de autenticación puede corresponder a tareas legítimas y necesita analizar tipo, cuenta y horario.",
    "steps": [
      {
        "title": "Buscá autenticaciones recientes",
        "why": "La lectura puede requerir permiso al registro de Seguridad.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,Message",
        "expect": "El detalle puede incluir cuentas y tipos de inicio; contiene información privada."
      },
      {
        "title": "Buscá intentos fallidos",
        "why": "Los fallos aislados pueden ser errores de contraseña o actividad normal.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4625;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Puede no haber entradas; eso no demuestra que el dispositivo no haya sido atacado."
      },
      {
        "title": "Contrastá con usuarios locales",
        "why": "Relacioná eventos únicamente con las cuentas que administrás.",
        "code": "Get-LocalUser | Select-Object Name,Enabled,LastLogon",
        "expect": "Algunas fechas pueden estar vacías y no cubren todo tipo de inicio de sesión."
      }
    ],
    "tip": "Truco: no confundas evento 4624 tipo 3 (red) con inicio interactivo frente a la pantalla.",
    "warning": "No publiques eventos con nombres de usuario, direcciones o identificadores de sesión.",
    "challenge": "Explicá qué tipo de evidencia indicarías en un informe antes de afirmar que alguien accedió mientras dormías."
  },
  {
    "id": 81,
    "goal": "Encontrar cuentas locales de Windows y diferenciar personas de cuentas del sistema.",
    "basics": "Windows puede contener cuentas incorporadas, usuarios de servicio y perfiles inactivos. Ocultas en la pantalla de acceso no equivale a clandestinas ni a comprometidas.",
    "steps": [
      {
        "title": "Enumerá usuarios locales",
        "why": "Consultá su estado sin alterar contraseñas.",
        "code": "Get-LocalUser | Select-Object Name,Enabled,Description,LastLogon",
        "expect": "Pueden aparecer cuentas que nunca inician sesión interactiva."
      },
      {
        "title": "Revisá grupos locales",
        "why": "Los grupos asignan funciones y privilegios; sus nombres pueden variar por idioma.",
        "code": "Get-LocalGroup | Select-Object Name,SID,Description",
        "expect": "Se muestran grupos integrados y creados por el administrador."
      },
      {
        "title": "Identificá tu sesión",
        "why": "Conocé el usuario y sus grupos efectivos.",
        "code": "whoami /groups",
        "expect": "La salida puede ser larga; representa grupos del token actual, no necesariamente todas las cuentas existentes."
      }
    ],
    "tip": "Truco: los identificadores SID permiten reconocer ciertos grupos aunque Windows esté en otro idioma.",
    "warning": "No elimines cuentas integradas ni perfiles antiguos sin comprobar su función y respaldo.",
    "challenge": "Elegí una cuenta integrada y explicá por qué puede ser normal que esté deshabilitada."
  },
  {
    "id": 82,
    "goal": "Saber quién tiene privilegios elevados y cuáles utiliza tu sesión.",
    "basics": "Ser administrador de un grupo no significa ejecutar siempre cada proceso elevado: UAC separa contextos. Una auditoría necesita grupos, tokens y políticas efectivas.",
    "steps": [
      {
        "title": "Identificá grupos administrativos",
        "why": "Buscá por SID para evitar depender del idioma de la instalación.",
        "code": "Get-LocalGroup | Where-Object {$_.SID.Value -eq 'S-1-5-32-544'} | Select-Object Name,SID",
        "expect": "Debería aparecer el grupo de administradores locales si el cmdlet está disponible."
      },
      {
        "title": "Consultá los grupos del token",
        "why": "whoami muestra pertenencia y atributos de grupos del usuario actual.",
        "code": "whoami /groups",
        "expect": "Podés ver Administradores como grupo con estados diferentes según elevación."
      },
      {
        "title": "Compará integridad y privilegios",
        "why": "El token informa privilegios asignados, que pueden estar deshabilitados hasta que se necesiten.",
        "code": "whoami /priv",
        "expect": "La presencia de un privilegio no significa que esté activo."
      }
    ],
    "tip": "Truco: comprobá si abriste PowerShell elevado antes de interpretar un error 'Acceso denegado'.",
    "warning": "No añadas cuentas a Administradores para solucionar problemas menores: aumentás la superficie de riesgo.",
    "challenge": "Explicá diferencia entre cuenta administradora, UAC y consola elevada."
  },
  {
    "id": 83,
    "goal": "Reconocer trucos con nombres de archivos y extensiones engañosas.",
    "basics": "Windows puede ocultar extensiones conocidas en algunas configuraciones; un documento aparente podría ser un ejecutable. El icono es decorativo y no confirma el formato real.",
    "steps": [
      {
        "title": "Identificá la extensión de un archivo seguro",
        "why": "Usá un archivo de prueba propio; el código no lo abre.",
        "code": "[IO.Path]::GetExtension('factura.pdf.exe')",
        "expect": "El resultado es .exe aunque el nombre incluya '.pdf'."
      },
      {
        "title": "Compará extensiones habituales",
        "why": "La clase Path permite investigar ejemplos sin tocar archivos.",
        "code": "'informe.docx','informe.docx.lnk','foto.jpg.scr' | ForEach-Object { [pscustomobject]@{ Archivo=$_; Extension=[IO.Path]::GetExtension($_) } }",
        "expect": "El último sufijo determina la extensión devuelta por el método."
      },
      {
        "title": "Activá visualización para inspeccionar",
        "why": "Abrí Opciones de carpeta y buscá la opción para mostrar extensiones conocidas.",
        "code": "Start-Process control.exe -ArgumentList 'folders'",
        "expect": "La ubicación de la preferencia varía con la edición."
      }
    ],
    "tip": "Truco: jamás decidas si abrir un adjunto basándote únicamente en su icono.",
    "warning": "No ejecutes ejemplos con extensiones .scr, .exe, .lnk o scripts de origen desconocido.",
    "challenge": "Explicá por qué 'archivo.pdf.exe' no se convierte en PDF por tener esas tres letras en medio."
  },
  {
    "id": 84,
    "goal": "Auditar si hay capacidades de escritorio remoto habilitadas.",
    "basics": "Remote Desktop, asistencia rápida y software de terceros son soluciones diferentes. Un servicio presente o un puerto abierto no confirma una sesión remota activa.",
    "steps": [
      {
        "title": "Consultá el servicio de Escritorio remoto",
        "why": "TermService participa en funciones RDP cuando están disponibles.",
        "code": "Get-Service TermService -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "El estado no describe todas las configuraciones de acceso remoto."
      },
      {
        "title": "Revisá el puerto RDP convencional",
        "why": "3389 es frecuente pero puede personalizarse, y escuchar no significa exposición pública.",
        "code": "Get-NetTCPConnection -LocalPort 3389 -State Listen -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,OwningProcess",
        "expect": "Podés ver un listener o ninguna fila."
      },
      {
        "title": "Revisá permisos en Configuración",
        "why": "Abrí las opciones oficiales de Escritorio remoto.",
        "code": "Start-Process 'ms-settings:remotedesktop'",
        "expect": "Windows puede mostrar la opción deshabilitada o no disponible según edición."
      }
    ],
    "tip": "Truco: auditá además herramientas de asistencia remota legítimas instaladas, sin asumir que usan RDP.",
    "warning": "No abras puertos en el router para hacer pruebas y no deshabilites gestión remota corporativa sin autorización.",
    "challenge": "Explicá qué datos necesitarías para demostrar una conexión remota real."
  },
  {
    "id": 85,
    "goal": "Investigar ubicaciones de ejecutables sin perseguir archivos del sistema.",
    "basics": "Las aplicaciones pueden instalarse en Program Files, AppData u otras rutas. La ubicación orienta la investigación, pero no existe una carpeta cuya sola presencia pruebe malware.",
    "steps": [
      {
        "title": "Enumerá rutas de procesos",
        "why": "Consultá ejecutables mediante CIM; algunas rutas estarán protegidas.",
        "code": "Get-CimInstance Win32_Process | Select-Object -First 25 Name,ProcessId,ExecutablePath",
        "expect": "Los procesos pueden quedar sin ruta por permisos o por finalización."
      },
      {
        "title": "Verificá un ejemplo confiable",
        "why": "Consultá atributos sin ejecutar nada.",
        "code": "Get-Item (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object FullName,Length,LastWriteTime",
        "expect": "Verás la ubicación del ejemplo y datos de archivo."
      },
      {
        "title": "Comprobá una firma digital",
        "why": "Una firma válida añade contexto, no convierte a un binario en seguro automáticamente.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object Status",
        "expect": "Podría indicar Valid o un estado distinto según sistema y firma."
      }
    ],
    "tip": "Truco: la combinación de ruta, hash, firma, fabricante y conducta es más útil que cualquier atributo por separado.",
    "warning": "No borres AppData, System32 o ProgramData buscando supuestos archivos ocultos.",
    "challenge": "Creá una ficha de verificación para un archivo de prueba sin abrirlo."
  },
  {
    "id": 86,
    "goal": "Aprender qué indicios podrían justificar investigar participación en una botnet.",
    "basics": "Una botnet usa equipos comprometidos para ejecutar acciones coordinadas. Tráfico inusual, consumo o tareas desconocidas son indicadores débiles por separado; deben correlacionarse antes de concluir compromiso.",
    "steps": [
      {
        "title": "Medí actividad de red acumulada",
        "why": "Tomá lecturas de la misma interfaz en un intervalo definido.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "Las cifras aumentan por muchas razones legítimas, como sincronización."
      },
      {
        "title": "Identificá conexiones de procesos",
        "why": "Limitá la lista para crear un inventario inicial.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 25 RemoteAddress,RemotePort,OwningProcess",
        "expect": "Conexiones a muchas IP no son una prueba automática de botnet."
      },
      {
        "title": "Revisá servicios con inicio automático",
        "why": "La persistencia puede usar servicios, pero la mayoría son normales.",
        "code": "Get-CimInstance Win32_Service | Where-Object StartMode -eq 'Auto' | Select-Object -First 18 Name,State,PathName",
        "expect": "Investigá procedencia y necesidad sin deshabilitar nada."
      }
    ],
    "tip": "Truco: establecé un comportamiento normal antes de calificar como anómala una transferencia.",
    "warning": "Si sospechás infección activa, protegé primero tus cuentas y realizá análisis con herramientas de seguridad confiables.",
    "challenge": "Elaborá tres hipótesis alternativas a una botnet para explicar consumo alto de red."
  },
  {
    "id": 87,
    "goal": "Reconocer procesos que imitan nombres habituales de Windows.",
    "basics": "Un atacante puede nombrar un programa como uno legítimo, pero también existen nombres muy parecidos creados por fabricantes. La ruta, firma y relación con servicios aportan mayor evidencia que el nombre solo.",
    "steps": [
      {
        "title": "Enumerá procesos de nombre parecido",
        "why": "Buscá algunos nombres frecuentes sin finalizar nada.",
        "code": "Get-CimInstance Win32_Process | Where-Object {$_.Name -match 'svchost|services|lsass|explorer'} | Select-Object Name,ProcessId,ExecutablePath",
        "expect": "Verás rutas, y algunas pueden quedar en blanco por seguridad."
      },
      {
        "title": "Relacioná servicios con PID",
        "why": "Una instancia de svchost puede hospedar varios servicios.",
        "code": "Get-CimInstance Win32_Service | Where-Object ProcessId -gt 0 | Select-Object -First 20 Name,ProcessId",
        "expect": "Se observa correspondencia, no legitimidad garantizada."
      },
      {
        "title": "Verificá un archivo original",
        "why": "Comprobá la firma de un ejecutable de Windows tomado de una ruta conocida.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\svchost.exe') | Select-Object Status",
        "expect": "El estado ayuda, aunque una comprobación adicional de integridad podría ser necesaria."
      }
    ],
    "tip": "Truco: investigá primero los procesos con rutas inesperadas y los cambios recientes, no la cantidad de instancias.",
    "warning": "No intentes finalizar lsass.exe, wininit.exe, services.exe ni otros procesos críticos.",
    "challenge": "Explicá por qué dos ejecutables con idéntico nombre pueden tener procedencias distintas."
  }
];
