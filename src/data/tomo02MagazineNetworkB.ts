import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Redes II · Investigaciones 139–150. Medición segura y auditoría de redes autorizadas. */
export const EVO_MAGAZINE_NETWORK_B: EvoMagazineArticle[] = [
  {
    "id": 139,
    "goal": "Comprender por qué un ping bajo no garantiza partidas fluidas ni descargas estables.",
    "basics": "ICMP mide respuestas del destino a pequeñas solicitudes, pero puede recibir un trato diferente del tráfico TCP/UDP de una aplicación. El jitter, la pérdida, rutas alternativas y saturación importan tanto como el promedio.",
    "steps": [
      {
        "title": "Registrá la puerta de enlace",
        "why": "La ruta local ayuda a separar Wi-Fi/LAN del camino hacia Internet.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Aparece el primer salto conocido; no toda conexión tiene puerta de enlace."
      },
      {
        "title": "Medí la red local",
        "why": "Probá tu propio router por unos segundos y observá variación y pérdidas.",
        "code": "$gw=(Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object -First 1).IPv4DefaultGateway.NextHop; Test-Connection -ComputerName $gw -Count 10",
        "expect": "La salida refleja ICMP hacia el router y puede no responder si bloquea ese protocolo."
      },
      {
        "title": "Compará con ruta externa",
        "why": "Elegí un destino público de prueba y hacé una medición corta.",
        "code": "Test-Connection 1.1.1.1 -Count 10",
        "expect": "La ruta externa incorpora más saltos; sus tiempos no equivalen al servidor real de juego."
      }
    ],
    "tip": "Truco EVO: anotá mínimo, máximo y pérdida, no sólo el promedio mostrado en un resultado.",
    "warning": "No optimices controladores ni modifiques buffers por un único paquete perdido.",
    "challenge": "Explicá cómo puede haber 8 ms de ping promedio y, aun así, microcortes durante la partida."
  },
  {
    "id": 140,
    "goal": "Decidir si conviene cambiar DNS mediante pruebas y objetivos concretos.",
    "basics": "El resolutor DNS afecta la traducción inicial de nombres y sus políticas de privacidad, pero no multiplica la velocidad de Internet ni mejora necesariamente el ping de un juego una vez conectada la sesión.",
    "steps": [
      {
        "title": "Identificá DNS actual",
        "why": "Primero registrá los servidores por interfaz.",
        "code": "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias,ServerAddresses",
        "expect": "Podés descubrir el router, servidores del ISP u otros."
      },
      {
        "title": "Consultá resolución normal",
        "why": "Usá un dominio de ejemplo reservado para medir respuesta funcional.",
        "code": "Resolve-DnsName example.com | Select-Object -First 8 Name,Type,IPAddress",
        "expect": "Verás direcciones o un error explicable si la red falla."
      },
      {
        "title": "Consultá un resolutor alternativo sin cambiarlo",
        "why": "El parámetro -Server dirige sólo esta prueba al resolutor indicado.",
        "code": "Resolve-DnsName example.com -Server 1.1.1.1 | Select-Object -First 8 Name,Type,IPAddress",
        "expect": "Podés comparar disponibilidad; esta consulta aislada no demuestra quién es más rápido de forma sostenida."
      }
    ],
    "tip": "Truco EVO: para comparar tiempos DNS repetí consultas separando caché, transporte y tipo de consulta.",
    "warning": "No cambies resolutores que use una organización, VPN o red empresarial sin autorización.",
    "challenge": "Definí tres criterios para elegir DNS: confiabilidad, privacidad y latencia de resolución."
  },
  {
    "id": 141,
    "goal": "Documentar tu propia red doméstica con un mapa simple y verificable.",
    "basics": "Una red doméstica conecta interfaces, router, switches, Wi-Fi y dispositivos. Un mapa útil especifica qué enlace es físico, qué equipo proporciona direcciones y quién administra cada recurso.",
    "steps": [
      {
        "title": "Listá adaptadores",
        "why": "Anotá nombre, velocidad y estado de cada interfaz visible.",
        "code": "Get-NetAdapter | Select-Object Name,Status,LinkSpeed,InterfaceDescription",
        "expect": "Pueden aparecer interfaces virtuales además de Ethernet y Wi-Fi."
      },
      {
        "title": "Consultá configuración IP",
        "why": "Identificá IP local, DNS y puerta de enlace de los adaptadores.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway,DNSServer",
        "expect": "Podés encontrar valores faltantes si una interfaz no está conectada."
      },
      {
        "title": "Buscá dispositivos que la PC recuerda",
        "why": "Los vecinos IPv4 son pistas, no un censo completo.",
        "code": "Get-NetNeighbor -AddressFamily IPv4 | Select-Object -First 20 IPAddress,LinkLayerAddress,State",
        "expect": "Algunas entradas son del pasado o del router."
      }
    ],
    "tip": "Truco EVO: dibujá el mapa empezando por el router y después agrandalo con conexiones confirmadas por vos.",
    "warning": "No incluyas contraseñas Wi-Fi, MAC ajenas, IP públicas ni información identificable en mapas compartidos.",
    "challenge": "Creá un plano con router, PC, móvil, impresora y un dispositivo IoT, marcando dónde hay Wi-Fi y cable."
  },
  {
    "id": 142,
    "goal": "Revisar controles del router que podrían exponer servicios innecesariamente.",
    "basics": "UPnP puede permitir a ciertas aplicaciones solicitar reglas de reenvío de puertos. La administración remota, contraseñas débiles o firmware desactualizado pueden aumentar el riesgo, según el modelo y el contexto.",
    "steps": [
      {
        "title": "Localizá la administración del router",
        "why": "Consultá tu puerta de enlace sin abrir puertos.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Obtenés el equipo que probablemente actúe como router local."
      },
      {
        "title": "Identificá el tipo de red Windows",
        "why": "Los perfiles del sistema no determinan por sí solos la configuración del router.",
        "code": "Get-NetConnectionProfile | Select-Object Name,NetworkCategory",
        "expect": "Puede indicar Public, Private o DomainAuthenticated."
      },
      {
        "title": "Comprobá servicios locales antes de evaluar NAT",
        "why": "Un port-forward sólo resulta útil cuando existe un servicio receptor apropiado.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress,LocalPort,OwningProcess",
        "expect": "Vas a ver listeners locales, no automáticamente reglas UPnP del router."
      }
    ],
    "tip": "Truco EVO: buscá en el panel de tu propio router UPnP, reenvío de puertos, administración WAN, WPS y versión de firmware.",
    "warning": "No actives administración desde Internet ni cambies el firmware sin manual y respaldo de configuración.",
    "challenge": "Explicá qué combinación de servicio local, firewall y router puede volver accesible un puerto."
  },
  {
    "id": 143,
    "goal": "Entender por qué HTTPS y el puerto 443 no garantizan que una web sea confiable.",
    "basics": "443 suele alojar HTTPS, que cifra conexiones TLS, pero los sitios fraudulentos también pueden usar certificados válidos. Un puerto es sólo un número de servicio; confiar exige validar dominio, certificado, contenido y finalidad.",
    "steps": [
      {
        "title": "Comprobá una conexión TLS de ejemplo",
        "why": "Test-NetConnection comprueba si un extremo acepta TCP en el puerto, no el certificado.",
        "code": "Test-NetConnection example.com -Port 443 | Select-Object ComputerName,RemotePort,TcpTestSucceeded",
        "expect": "Un True significa conexión TCP, no que el sitio sea seguro o legítimo."
      },
      {
        "title": "Revisá puertos remotos usados por programas",
        "why": "Una aplicación puede conectarse a diferentes servicios en 443.",
        "code": "Get-NetTCPConnection -State Established | Where-Object RemotePort -eq 443 | Select-Object -First 12 OwningProcess,RemoteAddress",
        "expect": "Verás conexiones a destinos diversos sin el contenido cifrado."
      },
      {
        "title": "Compará certificados en el navegador",
        "why": "Abrí https://example.com y revisá información del sitio y dominio, sin introducir credenciales.",
        "code": "Resolve-DnsName example.com | Select-Object -First 5 Name,IPAddress",
        "expect": "DNS muestra direcciones, pero no la identidad del propietario ni la reputación del sitio."
      }
    ],
    "tip": "Truco EVO: antes de introducir contraseñas, mirá cuidadosamente el dominio completo aunque aparezca un candado.",
    "warning": "No instalés certificados raíz de procedencia desconocida para eliminar advertencias del navegador.",
    "challenge": "Explicá qué verifica TLS y por qué un sitio de phishing puede usar HTTPS."
  },
  {
    "id": 144,
    "goal": "Descubrir qué interfaz transporta más tráfico sin culpar a un proceso sin pruebas.",
    "basics": "Los contadores de adaptador suman tráfico de todas las aplicaciones de la interfaz. Para encontrar un programa responsable hace falta correlacionar sesiones, transferencias y herramientas de supervisión con una ventana temporal.",
    "steps": [
      {
        "title": "Registrá contadores",
        "why": "Estos valores incluyen tráfico de varios procesos y se acumulan en el tiempo.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "La salida no representa un caudal instantáneo."
      },
      {
        "title": "Observá procesos conectados",
        "why": "El número de sesiones no indica cuántos bytes envía cada programa.",
        "code": "Get-NetTCPConnection -State Established | Group-Object OwningProcess | Sort-Object Count -Descending | Select-Object -First 10 Name,Count",
        "expect": "Se muestra la cantidad de sesiones por PID en ese instante."
      },
      {
        "title": "Abrí Monitor de recursos",
        "why": "En la pestaña Red compará envío y recepción por proceso cuando estén disponibles.",
        "code": "Start-Process resmon.exe",
        "expect": "Vas a ver actividad más contextual, aunque no toda transferencia se atribuye de forma perfecta."
      }
    ],
    "tip": "Truco EVO: si alguien afirma que un proceso 'consume toda la red', pedile bytes por segundo y durante cuánto tiempo.",
    "warning": "No cierres sincronización, respaldo o antivirus sin verificar su actividad y necesidad.",
    "challenge": "Anotá el proceso con mayor tráfico durante una descarga legítima y cómo cambió después."
  },
  {
    "id": 145,
    "goal": "Separar velocidad de enlace, caudal útil y ancho de banda contratado.",
    "basics": "Un enlace Ethernet de 1 Gbps no proporciona exactamente 1 Gbps de datos de aplicación: hay cabeceras, protocolos, capacidad del servidor, ISP y congestión. Latencia y caudal son magnitudes distintas.",
    "steps": [
      {
        "title": "Consultá negociación de red",
        "why": "Get-NetAdapter reporta el enlace local entre tu NIC y el switch o router.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed",
        "expect": "La velocidad no equivale a la descarga que vende el ISP."
      },
      {
        "title": "Revisá errores de interfaz",
        "why": "Las estadísticas del adaptador pueden exponer descartes y errores, dependiendo del driver.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes,ReceivedPacketErrors,OutboundPacketErrors",
        "expect": "Algunos contadores pueden no estar disponibles o permanecer en cero."
      },
      {
        "title": "Contrastá con velocidad de red declarada",
        "why": "Identificá el adaptador y registrá modelo para consultar su ficha.",
        "code": "Get-NetAdapter | Select-Object Name,InterfaceDescription,LinkSpeed",
        "expect": "Un mismo adaptador puede negociar diferentes velocidades según cable o puerto."
      }
    ],
    "tip": "Truco EVO: convertí unidades antes de comparar: MB/s de una descarga no es lo mismo que Mb/s del plan del ISP.",
    "warning": "No fuerces dúplex o velocidad para perseguir un porcentaje sin comprobar compatibilidad del otro extremo.",
    "challenge": "Explicá por qué una descarga de 100 MB/s no representa exactamente 100 Mbps."
  },
  {
    "id": 146,
    "goal": "Diagnosticar por qué la red local puede seguir funcionando aunque se corte Internet.",
    "basics": "La LAN conecta equipos entre sí; la salida a Internet depende de router, ruta WAN, DNS y proveedor. Un fallo de DNS puede parecer Internet caído aunque algunos destinos IP respondan.",
    "steps": [
      {
        "title": "Probá tu router",
        "why": "Consultá y probá la puerta de enlace propia.",
        "code": "$gw=(Get-NetIPConfiguration | Where-Object IPv4DefaultGateway | Select-Object -First 1).IPv4DefaultGateway.NextHop; Test-Connection $gw -Count 4",
        "expect": "Si ICMP está habilitado, confirma conectividad local con el router."
      },
      {
        "title": "Probá una dirección externa sin DNS",
        "why": "Usá un destino de diagnóstico conocido.",
        "code": "Test-Connection 1.1.1.1 -Count 4",
        "expect": "Si responde, existe algún camino IP. Una falla podría ser bloqueo ICMP y no desconexión total."
      },
      {
        "title": "Probá resolución de nombres",
        "why": "Consultá DNS independientemente de las dos pruebas anteriores.",
        "code": "Resolve-DnsName example.com | Select-Object -First 5 Name,IPAddress",
        "expect": "Un error DNS con conectividad IP puede orientar el diagnóstico hacia resolutores."
      }
    ],
    "tip": "Truco EVO: seguí este orden: adaptador → puerta de enlace → IP externa → DNS → aplicación.",
    "warning": "No reinicies o resetees el router si tenés servicios críticos sin informar a quienes dependen de la red.",
    "challenge": "Armá un árbol de decisión que diferencie fallo de Wi-Fi, router, ISP, DNS y sitio web."
  },
  {
    "id": 147,
    "goal": "Comprender qué cambia realmente cuando usás una VPN.",
    "basics": "Una VPN crea un túnel que protege el trayecto hacia su proveedor o servidor, pero ese proveedor puede ver información de conexión y las páginas todavía pueden identificarte por cuentas, cookies o huella de navegador.",
    "steps": [
      {
        "title": "Revisá adaptadores virtuales",
        "why": "Algunas VPN crean interfaces virtuales en Windows.",
        "code": "Get-NetAdapter | Select-Object Name,Status,InterfaceDescription",
        "expect": "Podés ver una interfaz VPN o ninguna; la ausencia no excluye todos los tipos de túneles."
      },
      {
        "title": "Consultá rutas actuales",
        "why": "La ruta predeterminada puede cambiar cuando un túnel está activo.",
        "code": "Get-NetRoute -AddressFamily IPv4 | Where-Object DestinationPrefix -eq '0.0.0.0/0' | Select-Object InterfaceAlias,NextHop,RouteMetric",
        "expect": "Se enumeran rutas, pero la tabla no prueba qué datos están cifrados."
      },
      {
        "title": "Observá resolutores configurados",
        "why": "Algunas VPN cambian servidores DNS para evitar fugas.",
        "code": "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias,ServerAddresses",
        "expect": "Podés ver resolutores de la VPN u otros; no demuestra por sí solo privacidad total."
      }
    ],
    "tip": "Truco EVO: distinguí confidencialidad del túnel, anonimato en sitios y política de datos del proveedor VPN.",
    "warning": "No instales una VPN desconocida con permisos de administrador para una prueba de curiosidad.",
    "challenge": "Explicá quién puede ver qué información sin VPN y quién podría verla cuando el túnel está activo."
  },
  {
    "id": 148,
    "goal": "Evaluar si tu computadora podría ser accesible desde el exterior sin probar direcciones ajenas.",
    "basics": "Un servicio que escucha localmente no es automáticamente accesible desde Internet. NAT, CGNAT, reglas del router, firewall y el tipo de interfaz cambian qué conexiones entrantes llegan al equipo.",
    "steps": [
      {
        "title": "Enumerá listeners propios",
        "why": "Consultá el sistema sin abrir nuevas puertas.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 25 LocalAddress,LocalPort,OwningProcess",
        "expect": "Los listeners pueden usar loopback o todas las interfaces."
      },
      {
        "title": "Revisá firewall por perfil",
        "why": "Un perfil puede bloquear conexiones entrantes de forma predeterminada.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
        "expect": "No reemplaza comprobar reglas específicas y alcance real."
      },
      {
        "title": "Identificá tu ruta y adaptador",
        "why": "Los datos locales ayudan a decidir qué router y política intervienen.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway",
        "expect": "IP privada y puerta de enlace no revelan tu IP pública ni exposición efectiva."
      }
    ],
    "tip": "Truco EVO: la verificación de exposición exige prueba desde otra red autorizada y análisis de reglas, no un 'escaneo milagroso'.",
    "warning": "No abras puertos ni desactives NAT/firewall para generar un resultado llamativo.",
    "challenge": "Explicá por qué un servicio en 127.0.0.1 no es equivalente a uno escuchando en 0.0.0.0."
  },
  {
    "id": 149,
    "goal": "Comprender amenazas frecuentes contra una red doméstica y priorizar defensas.",
    "basics": "Las amenazas incluyen claves débiles, configuraciones WAN expuestas, firmware desactualizado, dispositivos vulnerables y phishing. Una auditoría segura se centra en inventario, actualizaciones y aislamiento, no en atacar equipos.",
    "steps": [
      {
        "title": "Registrá tu puerta de enlace",
        "why": "Localizá el dispositivo que controla la red propia.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4DefaultGateway",
        "expect": "Identificar router permite buscar soporte oficial de fabricante."
      },
      {
        "title": "Revisá el perfil de red",
        "why": "Windows aplica reglas distintas a redes públicas y privadas.",
        "code": "Get-NetConnectionProfile | Select-Object Name,NetworkCategory",
        "expect": "El resultado no evalúa seguridad Wi-Fi, pero ayuda a contextualizar el firewall."
      },
      {
        "title": "Consultá estado del firewall",
        "why": "Comprobá que la protección esté habilitada.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
        "expect": "Un firewall habilitado reduce ciertas exposiciones pero no corrige contraseñas débiles del router."
      }
    ],
    "tip": "Truco EVO: priorizá firmware actualizado, WPA2-AES/WPA3, clave única, WPS desactivado cuando no se usa y acceso remoto restringido.",
    "warning": "No ejecutes herramientas de explotación en routers ajenos ni modifiques sus configuraciones sin autorización.",
    "challenge": "Elegí tres riesgos de tu red y escribí para cada uno una defensa preventiva y un método de verificación."
  },
  {
    "id": 150,
    "goal": "Realizar una auditoría doméstica de red que termine en conclusiones medibles y un plan de mantenimiento.",
    "basics": "El proyecto final de redes une hardware, direcciones IP, DNS, servicios, firewall y seguridad Wi-Fi. Cada conclusión debe tener prueba, fecha, contexto y recomendación reversible.",
    "steps": [
      {
        "title": "Inventariá interfaces, IP y DNS",
        "why": "Una sola consulta de configuración captura el contexto local.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway,DNSServer",
        "expect": "Obtendrás interfaces y parámetros; algunas propiedades estarán vacías en adaptadores desconectados."
      },
      {
        "title": "Documentá exposición y protección",
        "why": "Consultá puertos locales y perfiles del firewall.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress,LocalPort,OwningProcess; Get-NetFirewallProfile | Select-Object Name,Enabled",
        "expect": "Se mostrará información local, no prueba de exposición pública."
      },
      {
        "title": "Compará integridad de enlace",
        "why": "Los contadores por interfaz ayudan a documentar caudal y posibles errores.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed; Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "El enlace puede funcionar aun si fallan DNS o proveedor."
      }
    ],
    "tip": "Truco EVO: terminá con un expediente VERIFICADO / HIPÓTESIS / PENDIENTE y una fecha de próxima revisión.",
    "warning": "La auditoría debe limitarse a tu red o una red con autorización expresa; no compartas IP WAN, contraseñas ni MAC privadas.",
    "challenge": "Completá una lista con router, firmware, WPA, WPS, claves, clientes, IP, DNS, puertos, firewall, SMB, VPN, latencia, pérdida, respaldos y plan de recuperación."
  }
];
