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
| `GET` | `/health` | Estado del agente, versión, uptime, PID y token de sesión. |
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
