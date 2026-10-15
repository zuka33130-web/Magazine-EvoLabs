# EVO Local Agent (Windows Native Hardware Service)

Servicio local nativo para Windows que extrae telemetría y hardware mediante **CIM/WMI** para **EVO CORE**.

## 1. Dirección y Red
- **Host Local:** `127.0.0.1` (estrictamente localhost, prohibido `0.0.0.0`)
- **Puerto:** `43921`
- **URL Base:** `http://127.0.0.1:43921`

---

## 2. Endpoints Permitidos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado público del agente; nunca entrega códigos ni tokens. |
| `POST` | `/v1/pair` | Código local de uso único → token temporal ligado al Origin. |
| `POST` | `/v1/pair/revoke` | Revoca la sesión autenticada de este Origin. |
| `GET` | `/v1/machine` | Inventario completo de hardware del silicio vía CIM/WMI estructurado. |
| `GET` | `/v1/capabilities` | Capacidades soportadas del agente y clases WMI expuestas. |
| `GET` | `/v1/telemetry` | Muestreo de telemetría en tiempo real (CPU %, RAM libre/usada). |
| `POST` | `/v1/telemetry/start` | Inicia el muestreo periódico en segundo plano. |
| `POST` | `/v1/telemetry/stop` | Detiene el muestreo periódico. |

---

## 3. Clases CIM/WMI Reales Extraídas

1. `Win32_Processor` -> Nombre comercial, núcleos físicos, hilos lógicos, frecuencia base y máxima.
2. `Win32_BaseBoard` -> Fabricante, producto/modelo, versión, número de serie.
3. `Win32_BIOS` -> Fabricante, versión SMBIOS, fecha de lanzamiento.
4. `Win32_PhysicalMemory` -> Capacidad por módulo, fabricante, part number, frecuencia configurada y SPD, ubicación de zócalo.
5. `Win32_VideoController` -> Modelo de GPU, versión de driver, AdapterRAM verificada, resolución y tasa de refresco.
6. `Win32_DiskDrive` -> Modelo de disco, tipo de interfaz, MediaType, tamaño en bytes/GB.
7. `Win32_NetworkAdapter` -> Adaptadores físicos (Ethernet / Wi-Fi), tipo y velocidad.
8. `Win32_OperatingSystem` -> Edición de Windows, versión, número de compilación, arquitectura.

---

## 4. Reglas Epistémicas y Campos UNKNOWN

Principio fundamental de EVO LABS: **"NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."**

- **PSU:** Estrictamente `wattageW: 0`, `rating: 'UNKNOWN'`, `provenance: 'UNKNOWN'`. Windows no detecta fuentes por software.
- **Cooler:** Estrictamente `type: 'UNKNOWN'`, `tdpCapacityW: 0`, `provenance: 'UNKNOWN'`.
- **Case / Chassis:** Estrictamente `model: 'UNKNOWN'`, `formFactor: 'UNKNOWN'`, `provenance: 'UNKNOWN'`.
- **Fans:** Estrictamente `count: 0`, `sizeMm: 0`, `provenance: 'UNKNOWN'`.
- **RAM Channels:** Estrictamente `channels: 0` (`UNKNOWN`). Prohibido inferir canales por cantidad de módulos.
- **VRAM:** Estrictamente `UNKNOWN` si `AdapterRAM` reporta `<= 0` o valores corruptos `> 64GB`.
- **Chipset:** `UNKNOWN` / `undefined` a menos que sea explícitamente reportado.
- Todos los datos provenientes de CIM/WMI se marcan con procedencia `SYSTEM_REPORTED`.

---

## 5. Reglas de Seguridad

- Prohibido escuchar en `0.0.0.0`.
- Prohibida la existencia de endpoints de tipo `/exec`, `/shell`, `/cmd`, `/run` o `eval`.
- Todas las consultas a PowerShell se ejecutan con `execFile` con argumentos array estáticos inmutables.
- Validación de `Origin` y token de sesión criptográfico en cada handshake.


## EOE 1.0 / agente 1.1.0

Actualizar e iniciar el agente con START-EVO-AGENT.cmd. En ANALIZAR MI PC → EVO LIVE TELEMETRY PRO, ingresar el código de seis dígitos de su consola. Vence en cinco minutos y rota al usarlo; cinco intentos fallidos bloquean el emparejamiento durante un minuto. Los tokens viven como máximo ocho horas, están ligados al Origin y el navegador los conserva solo en memoria. Recargar la página requiere volver a emparejar. `/health` y sus alias ya no entregan credenciales: clientes antiguos deben actualizarse. Las dos URL remotas autorizadas y localhost siguen siendo las únicas permitidas. No ampliar CORS para eludir una conexión rechazada.

`GET /v1/telemetry` conserva los campos legacy y añade `observability` (contrato en src/observabilityProtocol.ts). CPU inicial sin delta es null/UNKNOWN. El recolector compartido serializa peticiones, cachea durante un segundo y limita consultas CIM estáticas a cuatro segundos y 512 KiB. No es streaming ni modifica Windows. El muestreo de fondo legacy vence después de 15 segundos sin lectores. EOE utiliza GET bajo demanda: al detenerse no mantiene un timer del agente. Una consulta ya iniciada termina o vence dentro del timeout; no se mata un proceso de otro consumidor.

Las lecturas CIM se obtienen de Win32_PerfFormattedData_PerfOS_Memory, PerfDisk_PhysicalDisk, Tcpip_NetworkInterface y PerfProc_Process. Latencia de disco: diferencias de Win32_PerfRawData_PerfDisk_PhysicalDisk con fórmula PERF_AVERAGE_TIMER `((N1-N0)/Frequency_PerfTime)/(B1-B0)*1000` ms. Sin I/O completada, contador reiniciado o proveedor ausente: UNKNOWN, nunca cero fabricado. Referencia: https://learn.microsoft.com/en-us/windows/win32/perfctrs/perf-average-timer. Falta validar estas fuentes en una sesión Windows real; tests Linux de contrato no acreditan esa validación.

CPU del agente usa process.cpuUsage, 100% = un procesador lógico, excluyendo PowerShell. Se informa aparte CPU acumulada y RSS puntual del proceso PowerShell de cada captura; no son una tasa total ni un pico. Presión de memoria significa porcentaje físico usado, no PSI. Red agrega interfaces y puede incluir duplicación por interfaces virtuales. Procesos: unión top cinco CPU + top cinco working set privado. Sin eventos, alertas ni diagnóstico causal todavía.
