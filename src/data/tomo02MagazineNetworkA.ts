import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Redes I · Investigaciones 126,128–138. Prácticas autorizadas exclusivamente en redes propias. */
export const EVO_MAGAZINE_NETWORK_A: EvoMagazineArticle[] = [
  {
    "id": 126,
    "goal": "Identificar equipos de tu propia red Wi-Fi sin confundir direcciones antiguas con intrusos.",
    "basics": "En una red doméstica el router suele mantener una lista de clientes asociados y concesiones DHCP. La caché ARP o de vecinos de Windows puede incluir dispositivos que ya no están conectados, y no debe utilizarse como inventario definitivo.",
    "steps": [
      {
        "title": "Identificá tu interfaz inalámbrica",
        "why": "Mostrá adaptadores en uso y su velocidad de enlace.",
        "code": "Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object Name,InterfaceDescription,LinkSpeed",
        "expect": "Podés ver Wi-Fi, Ethernet y adaptadores virtuales; el nombre depende de tu equipo."
      },
      {
        "title": "Consultá vecinos conocidos",
        "why": "Get-NetNeighbor muestra IP y MAC que tu equipo ha aprendido en su red.",
        "code": "Get-NetNeighbor -AddressFamily IPv4 | Select-Object -First 25 InterfaceAlias,IPAddress,LinkLayerAddress,State",
        "expect": "Las entradas pueden estar obsoletas o incluir el router. No equivalen a dispositivos activos."
      },
      {
        "title": "Abrí el router de tu red",
        "why": "Consultá la puerta de enlace predeterminada y entrá por su dirección local desde tu navegador.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Deberías encontrar una puerta de enlace para la conexión activa; revisá allí la lista de clientes."
      }
    ],
    "tip": "Truco EVO: compará los clientes del router con tus dispositivos propios por nombre y MAC; la MAC puede ser aleatoria en móviles modernos.",
    "warning": "Auditá únicamente tu red o una administrada con permiso. No publiques contraseñas, MAC ni capturas del panel de administración.",
    "challenge": "Armá un inventario de tus equipos e indicá cuáles aparecen en el router y cuáles solo figuran en la caché local."
  },
  {
    "id": 128,
    "goal": "Relacionar una conexión TCP con su aplicación y su destino sin inventar un interlocutor humano.",
    "basics": "TCP permite que dos extremos intercambien datos; una conexión contiene direcciones y puertos, pero éstos no dicen por sí solos quién está detrás ni qué contenido viaja cifrado.",
    "steps": [
      {
        "title": "Enumerá extremos TCP",
        "why": "Consultá conexiones actuales sin abrir sockets nuevos.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 20 LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess",
        "expect": "Se ven extremos y el PID propietario; algunas conexiones finalizan en segundos."
      },
      {
        "title": "Descubrí el nombre del programa",
        "why": "Reemplazá 1234 por un OwningProcess que hayas visto.",
        "code": "Get-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Name,Id,Path",
        "expect": "Podés obtener una ruta o nada si el proceso terminó o no hay permisos."
      },
      {
        "title": "Comprobá si escucha algo local",
        "why": "Un socket en escucha difiere de una conexión establecida.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 12 LocalAddress,LocalPort,OwningProcess",
        "expect": "Verás receptores locales, no necesariamente accesibles desde Internet."
      }
    ],
    "tip": "Truco EVO: anotá PID, dirección, puerto y hora en una sola ficha, no en capturas separadas.",
    "warning": "No atribuyas delitos a servidores desconocidos ni bloquees direcciones sin identificar el servicio asociado.",
    "challenge": "Explicá la diferencia entre puerto local, puerto remoto y PID propietario."
  },
  {
    "id": 129,
    "goal": "Comprender qué información conserva el router sobre tu red.",
    "basics": "Un router doméstico suele conocer interfaces, concesiones de direcciones y dispositivos asociados. Sus registros dependen del modelo, la configuración y la retención; no todos los routers guardan el historial de navegación.",
    "steps": [
      {
        "title": "Localizá la puerta de enlace",
        "why": "Windows informa la ruta hacia la red externa.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "La puerta de enlace suele corresponder al router, aunque no siempre."
      },
      {
        "title": "Revisá tu perfil de conexión",
        "why": "El perfil identifica cómo Windows clasifica la red.",
        "code": "Get-NetConnectionProfile | Select-Object Name,InterfaceAlias,NetworkCategory,IPv4Connectivity",
        "expect": "Podés observar Public, Private o DomainAuthenticated según entorno."
      },
      {
        "title": "Consultá la configuración inalámbrica local",
        "why": "Si usás Wi-Fi, la interfaz muestra SSID y señal de la conexión actual.",
        "code": "netsh wlan show interfaces",
        "expect": "Si no hay Wi-Fi activo, puede no mostrar nada; no contiene el historial completo del router."
      }
    ],
    "tip": "Truco EVO: los menús útiles suelen llamarse 'clientes conectados', 'DHCP leases' y 'logs', pero varían entre fabricantes.",
    "warning": "Nunca compartas capturas que incluyan credenciales, IP WAN o datos de clientes de tu red.",
    "challenge": "Explicá qué cosas conoce tu PC, cuáles conoce el router y qué datos no están garantizados."
  },
  {
    "id": 130,
    "goal": "Investigar si hay dispositivos desconocidos en el Wi-Fi con un procedimiento responsable.",
    "basics": "Ver un nombre extraño en la lista de clientes no demuestra intrusión: impresoras, móviles con MAC aleatoria y dispositivos inteligentes suelen tener nombres genéricos. La fuente principal es el router que administrás.",
    "steps": [
      {
        "title": "Identificá tu red",
        "why": "Comprobá qué conexión está activa.",
        "code": "Get-NetConnectionProfile | Select-Object Name,InterfaceAlias,NetworkCategory",
        "expect": "Se muestra tu perfil local; no enumera clientes del router."
      },
      {
        "title": "Consultá vecinos vistos por Windows",
        "why": "Es una caché parcial y temporal, no un escaneo de seguridad.",
        "code": "Get-NetNeighbor -AddressFamily IPv4 | Select-Object -First 30 IPAddress,LinkLayerAddress,State",
        "expect": "Podés ver vecinos caducados o que ya se desconectaron."
      },
      {
        "title": "Contrastá con concesiones DHCP",
        "why": "Consultá la puerta de enlace y abrí desde navegador la lista de clientes de tu propio router.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Usá el panel del router para confirmar clientes; si hay uno realmente desconocido, revisá seguridad Wi-Fi."
      }
    ],
    "tip": "Truco EVO: una MAC con dirección privada aleatoria de un teléfono puede cambiar; documentá la pertenencia con el dueño del dispositivo.",
    "warning": "No intentes expulsar dispositivos ni capturar comunicaciones de terceros sin autorización.",
    "challenge": "Diseñá un plan para verificar un cliente extraño antes de cambiar la contraseña de tu red."
  },
  {
    "id": 131,
    "goal": "Observar comunicaciones del PC que no producen ventanas ni notificaciones.",
    "basics": "Los procesos pueden mantener conexiones automáticas para hora, sincronización, actualizaciones y certificados. Atribuirles espionaje requiere mucho más que observar paquetes o direcciones desconocidas.",
    "steps": [
      {
        "title": "Listá sesiones abiertas",
        "why": "La consulta refleja un instante de conexiones TCP.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 30 OwningProcess,RemoteAddress,RemotePort",
        "expect": "Verás PID y destinos que pueden cambiar con el tiempo."
      },
      {
        "title": "Relacioná con procesos",
        "why": "Usá un PID que aparezca para intentar identificar la aplicación.",
        "code": "Get-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Name,Path",
        "expect": "Cambiá 1234 por el PID encontrado. Algunos procesos ya habrán terminado."
      },
      {
        "title": "Medí si hubo transferencia",
        "why": "Los contadores de interfaz son acumulativos: necesitás dos muestras de la misma conexión.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "La diferencia en bytes entre capturas demuestra transferencia, no su finalidad."
      }
    ],
    "tip": "Truco EVO: la metodología es observar → identificar propietario → investigar dominio/servicio → interpretar, nunca empezar por la conclusión.",
    "warning": "No bloquees servicios esenciales ni recopiles paquetes de otros usuarios para elaborar una historia llamativa.",
    "challenge": "Documentá tres conexiones legítimas y explicá qué información no permite ver una conexión TCP."
  },
  {
    "id": 132,
    "goal": "Explicar por qué una descarga rápida no garantiza buena experiencia en juegos.",
    "basics": "Un enlace puede tener mucho ancho de banda pero sufrir latencia alta, jitter o pérdida. La estabilidad entre cliente y servidor importa más para ciertos juegos que la velocidad máxima de descarga.",
    "steps": [
      {
        "title": "Comprobá enlace local",
        "why": "LinkSpeed es velocidad negociada con router o switch, no tu velocidad contratada.",
        "code": "Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object Name,LinkSpeed",
        "expect": "Podés ver 1 Gbps u otra velocidad; no es un test de Internet."
      },
      {
        "title": "Medí respuestas del router",
        "why": "Probá únicamente tu puerta de enlace propia, sin buscar servidores desconocidos.",
        "code": "$gw=(Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object -First 1).IPv4DefaultGateway.NextHop; Test-Connection -ComputerName $gw -Count 8",
        "expect": "Si ICMP responde, verás tiempos locales; si está bloqueado, no podés deducir la calidad del enlace."
      },
      {
        "title": "Compará con un destino externo conocido",
        "why": "Hacé una prueba breve de ICMP sin asumir que representa la ruta hacia el servidor del juego.",
        "code": "Test-Connection -ComputerName 1.1.1.1 -Count 8",
        "expect": "Respuestas y posibles pérdidas, sujetas a políticas ICMP del destino."
      }
    ],
    "tip": "Truco EVO: investigá jitter y pérdida por separado del promedio de ping; el servidor real del juego puede seguir otra ruta.",
    "warning": "No cambies offloads, buffers o firewall por una única medición de 8 paquetes.",
    "challenge": "Explicá por qué 1 Gbps de enlace local puede coexistir con ping inestable."
  },
  {
    "id": 133,
    "goal": "Seguir el recorrido de un paquete y entender qué significa cada salto.",
    "basics": "La red reenvía paquetes entre routers hasta su destino; los saltos visibles dependen de respuestas ICMP y políticas de cada red. Un asterisco no prueba que un router esté averiado.",
    "steps": [
      {
        "title": "Identificá el primer salto",
        "why": "Mostrá la puerta de enlace predeterminada.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Usualmente el primer router de tu red será el siguiente salto."
      },
      {
        "title": "Realizá una ruta de diagnóstico breve",
        "why": "tracert identifica routers que responden en el trayecto.",
        "code": "tracert -d -h 12 1.1.1.1",
        "expect": "Vas a ver saltos y tiempos; algunos pueden responder con asteriscos."
      },
      {
        "title": "Compará con conectividad básica",
        "why": "Probá si se alcanza el destino mediante una comprobación distinta.",
        "code": "Test-Connection 1.1.1.1 -Count 4",
        "expect": "El resultado no garantiza cómo funcionan todas las aplicaciones ni protocolos."
      }
    ],
    "tip": "Truco EVO: separar 'no responde a traceroute' de 'no reenvía paquetes' evita diagnósticos falsos.",
    "warning": "No ejecutes trazas o escaneos intensivos sobre redes que no administrás.",
    "challenge": "Explicá qué significa TTL y por qué no todos los routers responden a ICMP."
  },
  {
    "id": 134,
    "goal": "Comprender cómo una URL se convierte en direcciones IP antes de cargar una página.",
    "basics": "DNS transforma nombres de dominio en datos como direcciones IPv4 e IPv6. Tu navegador podría usar su propio resolutor o caché; por eso la salida de Windows no siempre explica cada navegación.",
    "steps": [
      {
        "title": "Consultá tus servidores DNS",
        "why": "Enumerá resolutores configurados por interfaz.",
        "code": "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias,ServerAddresses",
        "expect": "Podés encontrar varios servidores o adaptadores virtuales."
      },
      {
        "title": "Resolvé un nombre de ejemplo",
        "why": "Usá el dominio reservado example.com para una consulta normal.",
        "code": "Resolve-DnsName example.com | Select-Object -First 8 Name,Type,IPAddress",
        "expect": "Obtendrás registros asociados al nombre, que pueden incluir IPv4 e IPv6."
      },
      {
        "title": "Comprobá la caché local",
        "why": "Una entrada de caché refleja un resultado guardado, no un historial completo de navegación.",
        "code": "Get-DnsClientCache | Select-Object -First 12 Entry,RecordType",
        "expect": "Puede haber registros antiguos o ninguno, según servicios."
      }
    ],
    "tip": "Truco EVO: DNS resuelve nombres, mientras HTTP(S) solicita contenido; son etapas relacionadas pero distintas.",
    "warning": "No cambies DNS de toda la red para probar un dominio que sólo falla en un navegador.",
    "challenge": "Explicá qué puede seguir funcionando cuando la resolución DNS falla pero ya conocés una dirección IP."
  },
  {
    "id": 135,
    "goal": "Diseñar una prueba larga de 1000 paquetes sin convertirla en un ataque de red.",
    "basics": "Una prueba prolongada permite observar pérdidas infrecuentes. La forma responsable es enviar ICMP a una puerta de enlace que administrás, con cadencia moderada y un registro del contexto, no bombardear equipos ajenos.",
    "steps": [
      {
        "title": "Identificá tu router",
        "why": "Seleccioná la puerta de enlace IPv4 de tu conexión activa.",
        "code": "Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Anotá la IP privada del equipo que vas a medir."
      },
      {
        "title": "Probá primero un intervalo corto",
        "why": "Confirmá que ICMP esté admitido antes de iniciar una sesión larga.",
        "code": "$gw=(Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object -First 1).IPv4DefaultGateway.NextHop; Test-Connection $gw -Count 10",
        "expect": "Si la interfaz responde, se muestran tiempos. Si no, verificá que el router permita ICMP."
      },
      {
        "title": "Realizá mil muestras con cadencia normal",
        "why": "En tu propia red, podés ampliar a mil solicitudes ICMP con la cadencia normal de ping; el destino se obtiene automáticamente de tu gateway. Esta prueba puede durar más de quince minutos. Interrumpila con Ctrl+C si necesitás.",
        "code": "$gw=(Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object -First 1).IPv4DefaultGateway.NextHop; ping.exe -n 1000 $gw",
        "expect": "Después de mil intentos o de interrumpir, Windows muestra el resumen de paquetes enviados, recibidos y perdidos, si el router responde a ICMP."
      }
    ],
    "tip": "Truco EVO: medí por separado Wi-Fi y Ethernet cuando sea posible; no son resultados comparables si cambiás de interfaz a mitad del ensayo.",
    "warning": "No envíes mil solicitudes a servidores ajenos ni repitas pruebas masivas durante horas; usá un destino propio y autorizado.",
    "challenge": "Calculá la pérdida porcentual y explicá por qué una prueba de 10 paquetes podría no detectar un fallo poco frecuente."
  },
  {
    "id": 136,
    "goal": "Comprobar qué archivos de tu propio equipo se comparten en la red local.",
    "basics": "Compartir archivos por SMB implica un recurso, usuarios autorizados y controles del firewall. Un compartido no significa acceso anónimo ni exposición al Internet público.",
    "steps": [
      {
        "title": "Consultá los recursos SMB locales",
        "why": "La consulta puede requerir privilegios administrativos para ciertos recursos.",
        "code": "Get-SmbShare | Select-Object Name,Path,Special,Description",
        "expect": "Aparecen compartidos administrativos y otros que hayas creado."
      },
      {
        "title": "Revisá permisos de un recurso propio",
        "why": "Cambiá EJEMPLO por el nombre de un recurso que administrás.",
        "code": "Get-SmbShareAccess -Name EJEMPLO -ErrorAction SilentlyContinue | Select-Object AccountName,AccessRight,AccessControlType",
        "expect": "Si existe el recurso, se muestran permisos de recurso compartido; no sustituyen ACL NTFS."
      },
      {
        "title": "Observá el perfil del firewall",
        "why": "Un perfil puede limitar conexiones SMB entrantes.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
        "expect": "Son políticas generales y no una prueba definitiva de accesibilidad."
      }
    ],
    "tip": "Truco EVO: el permiso efectivo depende tanto de SMB como de NTFS y de la identidad del usuario.",
    "warning": "No habilites invitado ni desactives el firewall para hacer funcionar un recurso compartido.",
    "challenge": "Explicá qué comprobarías antes de permitir que otra PC vea una carpeta."
  },
  {
    "id": 137,
    "goal": "Interpretar los dispositivos fantasma que Windows y el router aún recuerdan.",
    "basics": "Las cachés de vecinos, DHCP y dispositivos Plug and Play pueden conservar entradas antiguas. La presencia de un dispositivo recordado no implica que continúe conectado o enviando datos.",
    "steps": [
      {
        "title": "Leé vecinos IPv4",
        "why": "Estos registros pueden permanecer aunque el dispositivo ya no esté activo.",
        "code": "Get-NetNeighbor -AddressFamily IPv4 | Select-Object -First 25 IPAddress,LinkLayerAddress,State",
        "expect": "Estados como Stale indican información no confirmada recientemente."
      },
      {
        "title": "Consultá adaptadores presentes y ausentes",
        "why": "PnP puede registrar hardware desconectado previamente.",
        "code": "Get-PnpDevice -Class Net -ErrorAction SilentlyContinue | Select-Object FriendlyName,Status,InstanceId",
        "expect": "Podés ver adaptadores virtuales, presentes o deshabilitados."
      },
      {
        "title": "Separá inventario real de caché",
        "why": "Revisá la interfaz activa para entender qué red estás observando.",
        "code": "Get-NetAdapter | Select-Object Name,Status,InterfaceDescription",
        "expect": "Las interfaces virtuales y los adaptadores físicos pueden coexistir."
      }
    ],
    "tip": "Truco EVO: la lista de clientes asociados que ofrece tu router suele ser más útil que ARP para saber quién está conectado ahora.",
    "warning": "No bloquees MAC desconocidas por aparecer como Stale o Unreachable en la caché de Windows.",
    "challenge": "Explicá diferencia entre un vecino obsoleto, un dispositivo PnP desconectado y un cliente Wi-Fi conectado."
  },
  {
    "id": 138,
    "goal": "Evaluar la seguridad del Wi-Fi sin intentar descifrar contraseñas de terceros.",
    "basics": "La protección doméstica depende del protocolo (idealmente WPA3-Personal o WPA2-AES cuando corresponda), una contraseña robusta y una configuración segura del router. SSID oculto y filtrado MAC no son defensas fuertes por sí solos.",
    "steps": [
      {
        "title": "Consultá el estado inalámbrico",
        "why": "netsh muestra autenticación y cifrado del enlace en uso.",
        "code": "netsh wlan show interfaces",
        "expect": "Podés ver WPA2/WPA3 y señal; no revela la seguridad de todas las redes cercanas."
      },
      {
        "title": "Encontrá la puerta de enlace",
        "why": "La configuración más importante del Wi-Fi suele estar en el router.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Obtenés la ruta al equipo que administrás."
      },
      {
        "title": "Identificá tu perfil de red",
        "why": "Windows aplica políticas diferentes a redes públicas y privadas.",
        "code": "Get-NetConnectionProfile | Select-Object Name,NetworkCategory",
        "expect": "Un perfil privado no sustituye cifrado inalámbrico ni contraseñas fuertes."
      }
    ],
    "tip": "Truco EVO: una frase de contraseña larga y única suele aportar más que cambiar el nombre del SSID cada semana.",
    "warning": "Nunca muestres una clave real de Wi-Fi ni pruebes contraseñas de redes ajenas.",
    "challenge": "Explicá las diferencias entre WPA2-AES, WPA3, WPS y por qué conviene revisar la función de actualización del firmware."
  }
];
