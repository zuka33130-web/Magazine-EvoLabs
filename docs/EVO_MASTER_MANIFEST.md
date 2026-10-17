# EVO LABS // MASTER MANIFEST CANÓNICO
### INVENTARIO MAESTRO Y ESPECIFICACIÓN ANTI-REGRESIÓN

> **REGLA DE PROTECCIÓN ANTI-REGRESIÓN 01:**
> “NINGÚN REDISEÑO, REFACTOR O LIMPIEZA DE EVO LABS PUEDE ELIMINAR, OCULTAR, RENOMBRAR O SUSTITUIR UN ELEMENTO DE ESTE MANIFEST SIN AUTORIZACIÓN EXPLÍCITA DEL OWNER.”

---

## 1. COLECCIÓN OFICIAL DE LOS 12 TOMOS

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `TOMO-01` | CONOCÉ TU PC | Tomo / Volumen Editorial | `src/components/Chapter01View.tsx` a `Chapter07View.tsx`, `src/data/evoTomesExpandedData.ts` | `/tomo/01` / `currentView: chapter-XX` | COMPLETO / DISPONIBLE | Tomo 01 | VISIBLE | Volumen fundamental sobre arquitectura del silicio, buses, microprocesador, GPU, memorias, almacenamiento y límites físicos. Incluye Demo libre. |
| `TOMO-02` | LA BIBLIA NEGRA DE WINDOWS | Tomo / Volumen Editorial | `src/components/tomo02/Tomo02MasterPage.tsx`, `src/data/tomo02Data.ts`, `src/data/tomo02MasterSectors.ts` | `/tomo/02` / `currentView: tomo-02` | COMPLETO / DISPONIBLE | Tomo 02 | VISIBLE | Auditoría pericial profunda del Kernel NT, svchost, interrupciones DPC/ISR, registro profundo, servicios y scripts forenses con 11 sectores (00 al 10). |
| `TOMO-03` | REPARACIÓN DE PC | Tomo / Volumen Editorial | `src/components/tomo03/Tomo03MasterPage.tsx`, `src/data/tomo03Data.ts` | `/tomo/03` / `currentView: tomo-03` | COMPLETO / DISPONIBLE | Tomo 03 | VISIBLE | Metodología de diagnóstico deductivo en banco de taller, medición con multímetro en rieles ATX (+12V, +5V, +3.3V) y aislamiento instrumental de fallas. |
| `TOMO-04` | REPARACIÓN DE NOTEBOOKS | Tomo / Volumen Editorial | `src/components/tomo04/Tomo04MasterPage.tsx`, `src/data/tomo04Data.ts` | `/tomo/04` / `currentView: tomo-04` | COMPLETO / DISPONIBLE | Tomo 04 | VISIBLE | Microelectrónica aplicada a portátiles, análisis de circuitos de carga, etapas Buck PWM, lectura de diagramas esquemáticos y resolución de fallas térmicas. |
| `TOMO-05` | REDES | Tomo / Volumen Editorial | `src/components/tomo05/Tomo05MasterPage.tsx`, `src/data/tomo05Data.ts` | `/tomo/05` / `currentView: tomo-05` | COMPLETO / DISPONIBLE | Tomo 05 | VISIBLE | Comunicaciones TCP/IP, ruteo, buffers, latencia de paquetes, jitter, direccionamiento IPv4/IPv6, telemetría y diagnóstico forense de tráfico. |
| `TOMO-06` | CIBERSEGURIDAD | Tomo / Volumen Editorial | `src/components/tomo06/Tomo06MasterPage.tsx`, `src/data/tomo06Data.ts` | `/tomo/06` / `currentView: tomo-06` | COMPLETO / DISPONIBLE | Tomo 06 | VISIBLE | Defensa perimetral, análisis de vectores de ataque, protección de firmware UEFI, telemetría de amenazas y hardening de Ring 0 en el kernel. |
| `TOMO-07` | GAMING PRO / RENDIMIENTO | Tomo / Volumen Editorial | `src/components/tomo07/Tomo07MasterPage.tsx`, `src/data/tomo07Data.ts` | `/tomo/07` / `currentView: tomo-07` | COMPLETO / DISPONIBLE | Tomo 07 | VISIBLE | Metrología científica de fluidez, análisis de frametimes, percentiles 1% low, variabilidad temporal, pacing de frames y eliminación de stutter. |
| `TOMO-08` | ARRANQUE Y DIAGNÓSTICO | Tomo / Volumen Editorial | `src/components/tomo08/Tomo08MasterPage.tsx`, `src/data/tomo08Data.ts` | `/tomo/08` / `currentView: tomo-08` | COMPLETO / DISPONIBLE | Tomo 08 | VISIBLE | El viaje completo del hardware: señal eléctrica de encendido, POST, tablas ACPI, NVRAM de UEFI, BCD, bootmgfw, winload y resolución de BSODs de boot. |
| `TOMO-09` | PROGRAMACIÓN DESDE CERO | Tomo / Volumen Editorial | `src/components/tomo09/Tomo09MasterPage.tsx`, `src/data/tomo09Data.ts` | `/tomo/09` / `currentView: tomo-09` | COMPLETO / DISPONIBLE | Tomo 09 | VISIBLE | Lógica computacional estructurada, desarrollo de scripts de auditoría en TypeScript y Python, manipulación de datos y automatización para técnicos. |
| `TOMO-10` | PROMPT E IA AVANZADA | Tomo / Volumen Editorial | `src/components/tomo10/Tomo10MasterPage.tsx`, `src/data/tomo10Data.ts` | `/tomo/10` / `currentView: tomo-10` | COMPLETO / DISPONIBLE | Tomo 10 | VISIBLE | Ingeniería de contexto, prompting determinista, arquitecturas RAG, orquestación de agentes periciales y validación empírica sin alucinaciones. |
| `TOMO-11` | ELECTRÓNICA APLICADA A LA INFORMÁTICA | Tomo / Volumen Editorial | `src/components/tomo11/Tomo11MasterPage.tsx`, `src/data/tomo11Data.ts` | `/tomo/11` / `currentView: tomo-11` | COMPLETO / DISPONIBLE | Tomo 11 | VISIBLE | Fundamentos físicos del electrón, leyes de Kirchhoff, fuentes conmutadas, DrMOS, diseño de VRM multietapa y trazado de Power Sequence en placas madre. |
| `TOMO-12` | INGENIERÍA Y CREACIÓN DE VIDEOJUEGOS | Tomo / Volumen Editorial | `src/components/tomo12/Tomo12MasterPage.tsx`, `src/data/tomo12Data.ts` | `/tomo/12` / `currentView: tomo-12` | COMPLETO / DISPONIBLE | Tomo 12 | VISIBLE | Arquitectura de motores gráficos, game loop con delta time determinista ($dt$), shaders GLSL, álgebra lineal y progresión técnica del proyecto Mundo Max. |

---

## 2. CAPÍTULOS Y SECTORES POR TOMO

### Tomo 01 — Capítulos y Estaciones
| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `T01-CAP-01` | La Verdad Detrás de los FPS | Capítulo Editorial | `src/components/Chapter01View.tsx` | `currentView: chapter-01` | COMPLETO | Tomo 01 | VISIBLE | Desmitificación inicial del rendimiento gráfico frente a los límites físicos del hardware. |
| `T01-CAP-02` | El Viaje del Dato | Capítulo Editorial | `src/components/Chapter02View.tsx`, `src/components/chapter02/` | `currentView: chapter-02` | COMPLETO | Tomo 01 | VISIBLE | Travesía de la información desde el SSD y la RAM hasta el núcleo de cómputo y la GPU. |
| `T01-CAP-02-S1` | Estación 01: Journey | Estación de Laboratorio | `src/components/chapter02/Station01Journey.tsx` | Embebido en Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Mapeo interactivo de buses PCIe, DMI y memoria. |
| `T01-CAP-02-S2` | Estación 02: Memoria | Estación de Laboratorio | `src/components/chapter02/Station02Memory.tsx` | Embebido en Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Análisis de latencia de acceso a DRAM vs Caché L1/L2/L3. |
| `T01-CAP-02-S3` | Estación 03: Gráficos | Estación de Laboratorio | `src/components/chapter02/Station03Graphics.tsx` | Embebido en Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Ingestión de geometrías y transferencia VRAM. |
| `T01-CAP-02-S4` | Estación 04: Almacenamiento | Estación de Laboratorio | `src/components/chapter02/Station04Storage.tsx` | Embebido en Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Rendimiento de colas NVMe y acceso aleatorio 4K. |
| `T01-CAP-02-S5` | Estación 05: Lab | Estación de Laboratorio | `src/components/chapter02/Station05Lab.tsx` | Embebido en Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Consolidación y validación experimental del viaje del dato. |
| `T01-CAP-03` | FPS vs Frametime | Capítulo Editorial | `src/components/Chapter03View.tsx`, `src/components/chapter03/` | `currentView: chapter-03` | COMPLETO | Tomo 01 | VISIBLE | Metrología de consistencia de fotogramas, microstutter y percentiles 1% low. |
| `T01-CAP-04` | El Cuello de Botella | Capítulo Editorial | `src/components/Chapter04View.tsx`, `src/components/chapter04/` | `currentView: chapter-04` | COMPLETO | Tomo 01 | VISIBLE | Identificación rigurosa de componentes limitantes en la cadencia de renderizado. |
| `T01-CAP-05` | Los Demonios de Fondo | Capítulo Editorial | `src/components/Chapter05View.tsx`, `src/components/chapter05/` | `currentView: chapter-05` | COMPLETO | Tomo 01 | VISIBLE | Aislamiento forense de telemetría, procesos parásitos, tareas programadas e interrupciones DPC. |
| `T01-CAP-06` | El Taller del Misterio | Capítulo Editorial | `src/components/Chapter06View.tsx`, `src/components/chapter06/` | `currentView: chapter-06` | COMPLETO | Tomo 01 | VISIBLE | Casos prácticos de banco con formulación de hipótesis, descarte instrumental e intervenciones. |
| `T01-CAP-07` | El Experimento Final | Capítulo Editorial | `src/components/Chapter07View.tsx`, `src/components/chapter07/` | `currentView: chapter-07` | COMPLETO | Tomo 01 | VISIBLE | Ensayo controlado de comparación A/B, generación de informe pericial y dossier del Tomo 01. |

### Tomo 02 — Sectores Maestros de la Biblia Negra de Windows
| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `T02-SEC-00` | Sector 00: Arquitectura del Kernel NT | Sector Técnico | `src/components/tomo02/sector00/` | `/tomo/02?sector=00` | COMPLETO | Tomo 02 | VISIBLE | Mapa anatómico de ntoskrnl.exe, HAL.dll, anillos de protección (Ring 0 a Ring 3) y microkernel. |
| `T02-SEC-01` | Sector 01: Procesos, Hilos y Concurrencia | Sector Técnico | `src/components/tomo02/sector01/` | `/tomo/02?sector=01` | COMPLETO | Tomo 02 | VISIBLE | Estructuras EPROCESS, ETHREAD, cambio de contexto, prioridades y planificador de Windows. |
| `T02-SEC-02` | Sector 02: Memoria Virtual y Paginación | Sector Técnico | `src/components/tomo02/sector02/` | `/tomo/02?sector=02` | COMPLETO | Tomo 02 | VISIBLE | VMM, tablas de páginas multinivel, Working Sets, Standby List y compresión de memoria. |
| `T02-SEC-03` | Sector 03: Interrupciones, DPC e ISR | Sector Técnico | `src/components/tomo02/sector03/` | `/tomo/02?sector=03` | COMPLETO | Tomo 02 | VISIBLE | IRQL, rutinas de servicio de interrupción (ISR), llamadas a procedimiento diferido (DPC) y latencia. |
| `T02-SEC-04` | Sector 04: Servicios de Windows y svchost | Sector Técnico | `src/components/tomo02/sector04/` | `/tomo/02?sector=04` | COMPLETO | Tomo 02 | VISIBLE | Service Control Manager (services.exe), grupos de svchost, cuentas de servicio y dependencias. |
| `T02-SEC-05` | Sector 05: El Registro de Windows | Sector Técnico | `src/components/tomo02/sector05/` | `/tomo/02?sector=05` | COMPLETO | Tomo 02 | VISIBLE | Arquitectura de colmenas (Hives), transacciones del registro, claves HKLM/HKCU e integridad. |
| `T02-SEC-06` | Sector 06: Secuencia de Inicio y Sesiones | Sector Técnico | `src/components/tomo02/sector06/` | `/tomo/02?sector=06` | COMPLETO | Tomo 02 | VISIBLE | Carga de winload.efi, smss.exe, csrss.exe, winlogon.exe, Userinit y creación de sesión de usuario. |
| `T02-SEC-07` | Sector 07: Subsistema I/O y Drivers | Sector Técnico | `src/components/tomo02/sector07/` | `/tomo/02?sector=07` | COMPLETO | Tomo 02 | VISIBLE | Paquetes de petición I/O (IRP), pilas de controladores (Device Stacks), filtros y modelos WDM/KMDF. |
| `T02-SEC-08` | Sector 08: Seguridad y Aislamiento del SO | Sector Técnico | `src/components/tomo02/sector08/` | `/tomo/02?sector=08` | COMPLETO | Tomo 02 | VISIBLE | Tokens de seguridad, SIDs, DACLs, integridad obligatoria (MIC), AppContainer y Virtualization-Based Security. |
| `T02-SEC-09` | Sector 09: Auditoría por CMD | Sector Técnico | `src/components/tomo02/sector09/` | `/tomo/02?sector=09` | COMPLETO | Tomo 02 | VISIBLE | Comandos de diagnóstico nativo: driverquery, tasklist, sc, sfc, dism y scripts de auditoría por lotes. |
| `T02-SEC-10` | Sector 10: Automatización y PowerShell | Sector Técnico | `src/components/tomo02/sector10/` | `/tomo/02?sector=10` | COMPLETO | Tomo 02 | VISIBLE | Cmdlets avanzados, pipeline de objetos, consultas WMI/CIM y herramientas automatizadas periciales. |

---

## 3. LABORATORIOS Y SIMULADORES

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `LAB-CORE` | EVO Lab Core (Universal PC Environment) | Laboratorio / Suite | `src/components/evoLabCore/EvoLabCore.tsx` | `currentView: lab-core` | COMPLETO | Global / Tomos 01-04 | VISIBLE | Entorno central con selector de máquinas, banco de reparación, optimización, actualización y ensamble universal. |
| `LAB-HOTSWAP` | Lab Hot-Swap de Hardware (Latencia ns) | Simulador Interactivo | `src/components/world/labs/sector02/Sector02HardwareHotSwap.tsx` | `currentView: hotswap-lab` | COMPLETO | Tomo 01 | VISIBLE | Modificación de componentes en tiempo real, recálculo físico de latencias (ns), buses y compatibilidad. |
| `LAB-SW-HOTSWAP` | Lab Software Hot-Swap | Simulador Interactivo | `src/components/world/labs/sector02/Sector02SoftwareHotSwap.tsx` | Embebido en Campus | COMPLETO | Tomo 01 | VISIBLE | Simulación de intervenciones en la capa de software, servicios y controladores. |
| `LAB-WINDOWS-MATRIX` | Matriz Forense de Servicios Windows | Simulador / Analizador | `src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx` | `currentView: windows-matrix-lab` | COMPLETO | Tomo 02 | VISIBLE | Auditoría interactiva de procesos de Windows, aislamiento de servicios parásitos y solución de dependencias. |
| `LAB-WINDOWS-XRAY` | Windows X-Ray Kernel Deep-Dive | Herramienta de Inspección | `src/components/world/labs/windowsMatrix/EvoWindowsXRayLab.tsx` | Embebido en Windows Matrix | COMPLETO | Tomo 02 | VISIBLE | Visualización radiográfica de capas del kernel, colas de planificación y descriptores de proceso. |
| `LAB-BOOT-SEQ` | Simulador de Secuencia de Boot y POST | Simulador de Arranque | `src/components/tomo08/EvoBootLab.tsx` | `currentView: boot-lab` | COMPLETO | Tomo 08 | VISIBLE | Simulación paso a paso de los 9 hitos de inicio del hardware y software con inyección de fallas. |
| `LAB-ULTIMATE-SANDBOX` | Evo Ultimate Sandbox | Entorno de Experimentación | `src/components/world/labs/ultimateSandbox/EvoUltimateSandbox.tsx` | Embebido en Campus | COMPLETO | Global | VISIBLE | Banco libre de pruebas y contrastes de hardware y software sin restricciones. |
| `LAB-SINGLE-TRUTH` | Evo Single Truth Surface | Superficie de Metrología | `src/components/world/labs/ultimateSandbox/EvoSingleTruthSurface.tsx` | Embebido en Sandbox | COMPLETO | Global | VISIBLE | Tablero unificado de telemetría y métricas deterministas de rendimiento. |
| `LAB-MASTER-SUITE` | Evo Master Lab Suite | Hub de Laboratorios | `src/components/world/labs/EvoMasterLabSuite.tsx` | Embebido en Mapa Mundo | COMPLETO | Global | VISIBLE | Suite maestra que orquesta los 8 laboratorios temáticos del mapa del mundo EVO. |
| `LAB-NET-FORENSICS` | Evo Network Forensics Lab | Laboratorio de Redes | `src/components/labs/tomo05/EvoNetworkForensicsLab.tsx` | `currentView: tomo-05` (Pestaña Lab) | COMPLETO | Tomo 05 | VISIBLE | Análisis de paquetes de red, pérdida de paquetes (loss), simulación de buffers e inspección DNS. |
| `LAB-DEFENSIVE-SEC` | Evo Defensive Security Lab | Laboratorio de Seguridad | `src/components/labs/tomo06/EvoDefensiveSecurityLab.tsx` | `currentView: tomo-06` (Pestaña Lab) | COMPLETO | Tomo 06 | VISIBLE | Prácticas de hardening, escaneo de vulnerabilidades y configuración de políticas defensivas. |
| `LAB-PERF-METROLOGY` | Evo Performance Metrology Lab | Laboratorio de Rendimiento | `src/components/labs/tomo07/EvoPerformanceMetrologyLab.tsx` | `currentView: tomo-07` (Pestaña Lab) | COMPLETO | Tomo 07 | VISIBLE | Captura y desgloses de variabilidad de frametime, curvas de percentiles y latencia de pantalla. |
| `LAB-CODE-ENG` | Evo Code Engineering Lab | Laboratorio de Programación | `src/components/labs/tomo09/EvoCodeEngineeringLab.tsx` | `currentView: tomo-09` (Pestaña Lab) | COMPLETO | Tomo 09 | VISIBLE | Editor de código en vivo y compilador interactivo para scripts periciales en navegador. |
| `LAB-AI-SYSTEMS` | Evo AI Systems Lab (Banco de Agentes) | Laboratorio de IA | `src/components/labs/tomo10/EvoAiSystemsLab.tsx` | `currentView: tomo-10` (Pestaña Lab) | COMPLETO | Tomo 10 | VISIBLE | Banco de pruebas de prompt estructurado, evaluación de RAG determinista y orquestación de agentes. |
| `LAB-GAME-FORGE` | Game Forge Studio & Mundo Max | Laboratorio de Videojuegos | `src/components/game-forge/GameForgeStudio.tsx` | `currentView: tomo-12` (Pestaña Lab) | COMPLETO | Tomo 12 | VISIBLE | Entorno de desarrollo de mecánicas 2D/3D, cálculo de paso de tiempo fijo ($dt$) y motor de físicas. |
| `LAB-ZONE-01` | Lab 01: Central de Incidentes | Zona de Laboratorio | `src/components/world/labs/Lab01CentralIncidentes.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Recepción, triaje y clasificación de fallas de clientes y equipos de prueba. |
| `LAB-ZONE-02` | Lab 02: Taller de Rendimiento | Zona de Laboratorio | `src/components/world/labs/Lab02TallerRendimiento.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Medición de framerate, overclocking seguro y optimización térmica. |
| `LAB-ZONE-03` | Lab 03: Archivo EVO | Zona de Laboratorio | `src/components/world/labs/Lab03ArchivoEvo.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Bóveda histórica de esquemáticos, diagramas de silicio y manuales periciales. |
| `LAB-ZONE-04` | Lab 04: Cámara de Experimentos | Zona de Laboratorio | `src/components/world/labs/Lab04CamaraExperimentos.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Espacio controlado para contrastes antes/después y experimentos de hipótesis. |
| `LAB-ZONE-05` | Lab 05: Sala de Máquinas | Zona de Laboratorio | `src/components/world/labs/Lab05SalaMaquinas.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Servidores centrales, banco de pruebas de redes y simulación de infraestructura. |
| `LAB-ZONE-06` | Lab 06: Zona Restringida | Zona de Laboratorio | `src/components/world/labs/Lab06ZonaRestringida.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Análisis de fallas catastróficas, daño por sobrevoltaje y casos forenses críticos. |
| `LAB-ZONE-07` | Lab 07: Mi Laboratorio | Zona de Laboratorio | `src/components/world/labs/Lab07MiLaboratorio.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Taller personalizado del estudiante con máquinas guardadas y proyectos propios. |
| `LAB-ZONE-08` | Lab 08: Comunidad EVO | Zona de Laboratorio | `src/components/world/labs/Lab08ComunidadEvo.tsx` | Campus / Mapa Mundo | COMPLETO | Global | VISIBLE | Banco compartido de soluciones periciales y expedientes contrastados por la comunidad. |

---

## 4. LAS 34 HERRAMIENTAS CANÓNICAS

| ID | NOMBRE | CATEGORÍA | ARCHIVO | DESTINO / ACCIÓN | ESTADO | TOMO | VISIBLE/OCULTO |
|---|---|---|---|---|---|---|---|
| `diag-boot-seq` | Diagnóstico de Secuencia de Boot | DIAGNOSTICAR | `src/components/tomo08/EvoBootLab.tsx` | Abre Boot Lab | DISPONIBLE | Tomo 08 | VISIBLE |
| `diag-bsod-decoder` | Decodificador Forense de BSOD | DIAGNOSTICAR | `src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx` | Escenario 'crash-repair' | DISPONIBLE | Tomo 02 | VISIBLE |
| `diag-incident-events` | Monitor de Eventos e Incidentes | DIAGNOSTICAR | `src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx` | Escenario 'services' | DISPONIBLE | Tomo 02 | VISIBLE |
| `diag-bottleneck-calc` | Calculador de Cuellos de Botella | DIAGNOSTICAR | `src/components/evoLabCore/views/EvoLabCoreBottleneckView.tsx` | Lab Core Misión BOTTLENECK | DISPONIBLE | Tomo 01 | VISIBLE |
| `diag-autodetect-pc` | Auto-Detección y Gemelo Digital PC | DIAGNOSTICAR | `src/components/common/EvoAutoDetectPcModal.tsx` | Evento 'evo_open_autodetect' | DISPONIBLE | Global | VISIBLE |
| `diag-telemetry-integrity` | Escáner de Integridad de Telemetría | DIAGNOSTICAR | `src/components/evoLabCore/components/EvoTelemetryIntegrityModal.tsx` | Modal de Integridad | DISPONIBLE | Global | VISIBLE |
| `diag-atx-power-bench` | Banco de Descarte de Rieles ATX | DIAGNOSTICAR | `src/components/evoLabCore/views/EvoLabCoreRepairView.tsx` | Lab Core Misión REPAIR | DISPONIBLE | Tomo 03 | VISIBLE |
| `diag-case-resolver` | Resolutor Deductivo de Casos | DIAGNOSTICAR | `src/components/common/EvoCaseResolverModal.tsx` | Evento 'evo_open_case_resolver' | DISPONIBLE | Tomo 03 | VISIBLE |
| `med-latency-calc` | Calculador de Latencia RAM (ns) | MEDIR | `src/components/tools/EvoLatencyCalculator.tsx` | Panel Hardware / Hot-Swap | DISPONIBLE | Tomo 01 | VISIBLE |
| `med-frametime-analyzer` | Analizador Metrológico de Frametimes | MEDIR | `src/components/chapter03/FpsLabStation.tsx` | Panel Telemetría / Hot-Swap | DISPONIBLE | Tomo 07 | VISIBLE |
| `med-sensors-telemetry` | Monitor de Sensores y Telemetría | MEDIR | `src/components/world/labs/EvoTelemetryHUD.tsx` | Panel Telemetría / Hot-Swap | DISPONIBLE | Global | VISIBLE |
| `med-dpc-latency` | Analizador de Latencia DPC/ISR | MEDIR | `src/components/tomo02/sector03/` | Escenario 'services' Matrix | DISPONIBLE | Tomo 02 | VISIBLE |
| `med-stress-stability` | Banco de Carga y Estabilidad | MEDIR | `src/components/evoLabCore/views/EvoLabCoreTestView.tsx` | Lab Core Misión TEST | DISPONIBLE | Tomo 04 | VISIBLE |
| `med-thermal-history` | Registro y Curva Térmica Dinámica | MEDIR | `src/components/world/labs/ultimateSandbox/EvoThermalHistoryModal.tsx` | Modal Curva Térmica | DISPONIBLE | Tomo 04 | VISIBLE |
| `inv-pcb-schematic` | Visor de Esquemáticos y Pistas PCB | INVESTIGAR | `src/components/world/EvoMotherboardCanvas.tsx` | Panel Hardware / Hot-Swap | DISPONIBLE | Tomo 04 | VISIBLE |
| `inv-xray-kernel` | Rayos X del Kernel de Windows | INVESTIGAR | `src/components/world/labs/windowsMatrix/EvoWindowsXRayLab.tsx` | Escenario 'scheduler' Matrix | DISPONIBLE | Tomo 02 | VISIBLE |
| `inv-cache-imc-flow` | Diagrama de Flujo Caché e IMC | INVESTIGAR | `src/components/world/labs/sector02/Sector02HardwareHotSwap.tsx` | Panel Hardware / Hot-Swap | DISPONIBLE | Tomo 01 | VISIBLE |
| `inv-digital-twin` | Gemelo Digital Interactivo | INVESTIGAR | `src/components/common/EvoDigitalTwinViewerModal.tsx` | Evento 'evo_open_digital_twin' | DISPONIBLE | Global | VISIBLE |
| `inv-workstations-sectors` | Matriz de Estaciones y Puestos | INVESTIGAR | `src/components/world/EvoSectorWorkstationModal.tsx` | Modal Puestos de Taller | DISPONIBLE | Global | VISIBLE |
| `inv-coverage-matrix` | Matriz de Cobertura Curricular | INVESTIGAR | `src/components/evoLabCore/components/CatalogCoverageDashboard.tsx` | Dashboard Cobertura | DISPONIBLE | Global | VISIBLE |
| `rep-windows-repair` | Asistente de Reparación Windows | REPARAR | `src/components/world/labs/windowsMatrix/repair/` | Escenario 'repair' Matrix | DISPONIBLE | Tomo 02 | VISIBLE |
| `rep-windows-install` | Simulador de Instalación Limpia | REPARAR | `src/components/world/labs/windowsMatrix/install/` | Escenario 'install' Matrix | DISPONIBLE | Tomo 02 | VISIBLE |
| `rep-hotswap-bench` | Banco Físico Hot-Swap | REPARAR | `src/components/world/labs/sector02/Sector02HardwareHotSwap.tsx` | Panel Sandbox / Hot-Swap | DISPONIBLE | Tomo 01 | VISIBLE |
| `rep-core-repair-view` | Diagnóstico y Reparación de Chasis | REPARAR | `src/components/evoLabCore/views/EvoLabCoreRepairView.tsx` | Lab Core Misión REPAIR | DISPONIBLE | Tomo 03 | VISIBLE |
| `opt-nt-services` | Optimizador de Servicios y Tareas | OPTIMIZAR | `src/components/world/labs/windowsMatrix/services/` | Escenario 'services' Matrix | DISPONIBLE | Tomo 02 | VISIBLE |
| `opt-core-optimization` | Banco de Ajuste de Rendimiento | OPTIMIZAR | `src/components/evoLabCore/views/EvoLabCoreOptimizationView.tsx` | Lab Core Misión OPTIMIZE | DISPONIBLE | Tomo 07 | VISIBLE |
| `opt-ab-comparison` | Comparador Controlado A/B | OPTIMIZAR | `src/components/chapter07/Phase07ComparisonStation.tsx` | Panel Sandbox / Hot-Swap | DISPONIBLE | Tomo 01 | VISIBLE |
| `opt-upgrade-simulator` | Simulador de Actualización de PC | OPTIMIZAR | `src/components/evoLabCore/views/EvoLabCoreUpgradeView.tsx` | Lab Core Misión UPGRADE | DISPONIBLE | Tomo 01 | VISIBLE |
| `opt-build-architect` | Arquitecto de Ensamble de PC | OPTIMIZAR | `src/components/tools/EvoPcBuildArchitect.tsx` | Lab Core Misión BUILD_PC | DISPONIBLE | Tomo 01 | VISIBLE |
| `doc-forensic-dossier` | Generador de Dossier Forense | DOCUMENTAR | `src/components/common/EvoForensicReportModal.tsx` | Modal Reporte Forense | DISPONIBLE | Global | VISIBLE |
| `doc-evidence-passport` | Pasaporte Técnico de Evidencia | DOCUMENTAR | `src/components/chapter02/InheritedPassportBanner.tsx` | Modal Dossier Técnico | DISPONIBLE | Tomo 01 | VISIBLE |
| `doc-technical-dossier` | Dossier Técnico Completo | DOCUMENTAR | `src/components/common/EvoTechnicalDossierModal.tsx` | Modal Dossier del Tomo | DISPONIBLE | Global | VISIBLE |
| `doc-content-factory` | Fábrica de Casos y Prácticas | DOCUMENTAR | `src/components/common/EvoContentFactoryModal.tsx` | Modal Fábrica de Casos | DISPONIBLE | Global | VISIBLE |
| `doc-transfer-challenge` | Desafíos de Transferencia Práctica | DOCUMENTAR | `src/components/common/EvoTransferChallengeModal.tsx` | Modal Desafíos Prácticos | DISPONIBLE | Global | VISIBLE |

---

## 5. ANALIZAR MI PC Y SUS FUNCIONES

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `PC-AUTODETECT` | Auto-Detección y Gemelo Digital de PC | Componente Modal | `src/components/common/EvoAutoDetectPcModal.tsx` | Invocado por Evento o Botón Navbar | COMPLETO | Global | VISIBLE | Captura telemetría de hardware real del navegador (núcleos de CPU, memoria, APIs WebGL/WebGPU) y construye el gemelo digital del usuario. |
| `PC-DIGITAL-TWIN-SERVICE` | Servicio de Gemelo Digital | Servicio Core | `src/services/evoInteractiveDigitalTwin.ts` | Backend de cliente | COMPLETO | Global | VISIBLE | Modela el comportamiento determinista de la máquina local y proyecta latencias e impactos en tiempo real. |
| `PC-HW-DISCOVERY` | Descubrimiento de Hardware | Componente Modal | `src/components/evoLabCore/components/EvoHardwareDiscoveryModal.tsx` | Invocado desde Lab Core | COMPLETO | Global | VISIBLE | Presenta el desglose pericial de la topología descubierta en la máquina examinada. |
| `PC-TELEMETRY-INTEGRITY` | Auditoría de Integridad de Telemetría | Servicio / Modal | `src/components/evoLabCore/services/telemetryIntegrityService.ts`, `EvoTelemetryIntegrityModal.tsx` | Invocado desde Herramientas / Lab Core | COMPLETO | Global | VISIBLE | Compara mediciones contra modelos de dispersión física para certificar que no existen datos manipulados o placebos. |
| `PC-BUS-DIAGRAM` | Diagrama de Buses en Vivo | Visualizador Técnico | `src/components/evoLabCore/components/EvoLiveMachineBusDiagram.tsx` | Integrado en Lab Core | COMPLETO | Global | VISIBLE | Representación esquemática animada de las pistas de interconexión (DMI, PCIe, canal de memoria) de la PC. |

---

## 6. TUTOR EVO (SISTEMA PEDAGÓGICO DE ACOMPAÑAMIENTO)

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `TUTOR-CONTEXT` | Tutor EVO Context & State | Contexto React | `src/components/tutor/TutorEvoContext.tsx` | Proveedor global | COMPLETO | Global | VISIBLE | Administra modo de lectura (Libre vs Guiado), ayudas por capítulo, conceptos activos y estado del asistente. |
| `TUTOR-BUTTON` | Botón Flotante Tutor EVO | Componente UI | `src/components/tutor/TutorEvoFloatingButton.tsx` | Flotante en interfaz | COMPLETO | Global | VISIBLE | Disparador persistente en pantalla para abrir el panel lateral del tutor interactivo. |
| `TUTOR-DRAWER` | Gaveta Lateral de Tutoría | Componente Drawer | `src/components/tutor/TutorEvoDrawer.tsx` | Desplegable lateral | COMPLETO | Global | VISIBLE | Panel con glosario técnico, pistas de investigación, orientación sobre el paso actual y modo pericial. |
| `TUTOR-ONBOARDING` | Modal de Bienvenida al Tutor | Modal Educativo | `src/components/tutor/TutorOnboardingModal.tsx` | Primer ingreso de usuario | COMPLETO | Global | VISIBLE | Presentación pedagógica de cómo interactuar con los laboratorios y el rigor técnico de EVO LABS. |
| `TUTOR-PROGRESS-MAP` | Mapa de Progreso y Hitos | Modal Educativo | `src/components/tutor/TutorProgressMapModal.tsx` | Invocado desde Drawer | COMPLETO | Global | VISIBLE | Matriz visual de competencias adquiridas y capítulos superados por el estudiante. |
| `TUTOR-PREFLIGHT` | Chequeo Pre-Flight de Laboratorio | Modal de Seguridad | `src/components/tutor/TutorPreFlightModal.tsx` | Previo a ingresar a Lab | COMPLETO | Global | VISIBLE | Verificación de prerrequisitos conceptuales antes de experimentar en simuladores. |
| `TUTOR-GLOSSARY` | Glosario Técnico Maestro | Base de Datos | `src/components/tutor/data/tutorGlossary.ts` | Consumido por Drawer | COMPLETO | Global | VISIBLE | Más de 50 términos canónicos de microelectrónica, arquitectura de computadoras y kernel de Windows. |
| `TUTOR-ACADEMY-DATA` | Estructura Curricular de la Academia | Base de Datos | `src/components/tutor/data/tutorAcademyData.ts` | Consumido por Tutor | COMPLETO | Global | VISIBLE | Rutas de formación, preguntas de autoevaluación y objetivos por nivel. |

---

## 7. MI EVO / PROGRESO / EXPEDIENTES

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `EXP-REPOSITORY` | Repositorio de Casos y Expedientes | Servicio de Persistencia | `src/components/evoLabCore/services/caseRepository.ts` | LocalStorage / Memoria | COMPLETO | Global | VISIBLE | Almacena y recupera expedientes periciales cerrados por el técnico, diagnósticos y reportes emitidos. |
| `EXP-HISTORY-MODAL` | Historial de Expedientes Registrados | Modal UI | `src/App.tsx` (`showCaseHistoryModal`) | Botón en Header de App | COMPLETO | Global | VISIBLE | Visualizador de casos completados en la sesión con fecha, título, resumen y conclusiones técnicas. |
| `EXP-PROGRESS-T01` | Motor de Progreso del Tomo 01 | Utilidad / Estado | `src/utils/tomo01Progress.ts` | `localStorage: evo_tomo01_*` | COMPLETO | Tomo 01 | VISIBLE | Rastrea capítulos completados (01 al 07), desbloqueo secuencial, aprobación de examen final y certificación. |
| `EXP-PASSPORT-BANNER` | Pasaporte de Evidencias Heredadas | Componente UI | `src/components/chapter02/InheritedPassportBanner.tsx` | Cabecera de Cap 02 | COMPLETO | Tomo 01 | VISIBLE | Muestra los hallazgos y evidencias arrastrados desde capítulos previos para su uso en la investigación actual. |
| `EXP-ACUMULADO-BANNER` | Banner de Expediente Acumulado | Componente UI | `src/components/chapter04/ExpedienteAcumuladoBanner.tsx`, `src/components/chapter05/` | Cabecera Cap 04/05 | COMPLETO | Tomo 01 | VISIBLE | Resumen continuo de pruebas recolectadas en el curso de la pericia técnica. |
| `EXP-STORAGE-SAFE` | Almacenamiento Seguro para Iframe | Utilidad Core | `src/utils/safeStorage.ts` | Transversal | COMPLETO | Global | VISIBLE | Capa de protección para persistencia de datos en entornos sandbox de iframe sin arrojar excepciones. |

---

## 8. EXÁMENES Y EVALUACIONES POR TOMO

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `EXAM-ENGINE` | Motor Canónico de Examen Pericial | Componente Motor | `src/components/exam/EvoTomeExamEngine.tsx` | Invocado por botón "Rendir Examen" | COMPLETO | Global (Tomos 01 al 12) | VISIBLE | Ejecuta exámenes de opción múltiple y casos periciales con tiempo límite, retroalimentación y cálculo de puntaje. |
| `EXAM-VISUAL-RENDERER` | Renderizador Visual de Examen | Componente UI | `src/components/exam/EvoExamVisualRenderer.tsx` | Embebido en ExamEngine | COMPLETO | Global | VISIBLE | Presenta preguntas técnicas con soporte para diagramas, código, bloques de opciones y barra de progreso. |
| `EXAM-STORAGE` | Almacén de Calificaciones de Exámenes | Utilidad | `src/components/exam/utils/examStorage.ts` | LocalStorage | COMPLETO | Global | VISIBLE | Guarda notas, estado aprobado/reprobado y fecha de acreditación de cada tomo. |
| `EXAM-T01-DATA` | Banco de Examen Tomo 01 | Banco de Preguntas | `src/components/exam/data/tomo01ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 01 | VISIBLE | Evaluación exhaustiva de arquitectura de hardware, latencias de memoria, buses y límites físicos. |
| `EXAM-T02-DATA` | Banco de Examen Tomo 02 | Banco de Preguntas | `src/components/exam/data/tomo02ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 02 | VISIBLE | Evaluación sobre Kernel NT, svchost, interrupciones DPC/ISR, registro y diagnóstico por consola. |
| `EXAM-T03-DATA` | Banco de Examen Tomo 03 | Banco de Preguntas | `src/components/exam/data/tomo03ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 03 | VISIBLE | Evaluación sobre diagnóstico deductivo, líneas de poder ATX y resolución de fallas en placa. |
| `EXAM-T04-DATA` | Banco de Examen Tomo 04 | Banco de Preguntas | `src/components/exam/data/tomo04ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 04 | VISIBLE | Evaluación sobre fuentes de notebook, conversores Buck, líneas de carga y lectura esquemática. |
| `EXAM-T05-DATA` | Banco de Examen Tomo 05 | Banco de Preguntas | `src/components/exam/data/tomo05ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 05 | VISIBLE | Evaluación sobre protocolos TCP/IP, análisis forense de paquetes, ruteo y diagnóstico de red. |
| `EXAM-T06-DATA` | Banco de Examen Tomo 06 | Banco de Preguntas | `src/components/exam/data/tomo06ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 06 | VISIBLE | Evaluación sobre hardening de sistemas, mitigación de exploits y seguridad de kernel. |
| `EXAM-T07-DATA` | Banco de Examen Tomo 07 | Banco de Preguntas | `src/components/exam/data/tomo07ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 07 | VISIBLE | Evaluación sobre metrología de fluidez, análisis de frametimes y percentiles de microstutter. |
| `EXAM-T08-DATA` | Banco de Examen Tomo 08 | Banco de Preguntas | `src/components/exam/data/tomo08ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 08 | VISIBLE | Evaluación sobre secuencia POST, UEFI, tablas BCD y resolución de pantallas azules de boot. |
| `EXAM-T09-DATA` | Banco de Examen Tomo 09 | Banco de Preguntas | `src/components/exam/data/tomo09ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 09 | VISIBLE | Evaluación sobre lógica de programación, algoritmos, scripts en TypeScript y Python. |
| `EXAM-T10-DATA` | Banco de Examen Tomo 10 | Banco de Preguntas | `src/components/exam/data/tomo10ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 10 | VISIBLE | Evaluación sobre prompting estructurado, RAG, arquitecturas de agentes y mitigación de alucinaciones. |
| `EXAM-T11-DATA` | Banco de Examen Tomo 11 | Banco de Preguntas | `src/components/exam/data/tomo11ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 11 | VISIBLE | Evaluación sobre electrónica de semiconductores, inductores, capacitores de filtrado y fases VRM. |
| `EXAM-T12-DATA` | Banco de Examen Tomo 12 | Banco de Preguntas | `src/components/exam/data/tomo12ExamData.ts` | Consumido por ExamEngine | COMPLETO | Tomo 12 | VISIBLE | Evaluación sobre arquitectura de motores de juego, game loop determinista y shaders en tiempo real. |
| `EXAM-T01-LEGACY` | Examen Final Dedicado Tomo 01 | Componente Examen | `src/components/tomo01/EvoTomo01FinalExam.tsx` | Embebido en Cap 07 | COMPLETO | Tomo 01 | VISIBLE | Interfaz histórica de evaluación pericial directa del Tomo 01 previa a la unificación. |
| `EXAM-T01-COMPLETION` | Pantalla de Certificación Tomo 01 | Componente Victoria | `src/components/tomo01/EvoTomo01CompletionScreen.tsx` | Tras aprobar examen T01 | COMPLETO | Tomo 01 | VISIBLE | Pantalla de celebración y acreditación oficial con credencial del estudiante para el Tomo 01. |
| `EXAM-T02-LEGACY` | Examen Final Dedicado Tomo 02 | Componente Examen | `src/components/tomo02/EvoTomo02FinalExam.tsx` | Embebido en Tomo 02 | COMPLETO | Tomo 02 | VISIBLE | Interfaz histórica de evaluación pericial directa del Tomo 02. |
| `EXAM-T02-COMPLETION` | Pantalla de Certificación Tomo 02 | Componente Victoria | `src/components/tomo02/EvoTomo02CompletionScreen.tsx` | Tras aprobar examen T02 | COMPLETO | Tomo 02 | VISIBLE | Pantalla de celebración y acreditación pericial para el Tomo 02. |

---

## 9. DEMOS Y CONTENIDO GRATUITO

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | TOMO ASOCIADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|---|
| `DEMO-LIBRE-T01` | Demo Libre Tomo 01 (Plan Gratis) | Flujo Editorial | `src/components/public/EvoPublicTomosCatalog.tsx` | Botón "ABRIR DEMO (PLAN GRATIS) →" | COMPLETO | Tomo 01 | VISIBLE | Apertura sin costo y sin tarjeta del Tomo 01 completo como muestra de calidad de la colección. |
| `MAG-01-VIEW` | Magazine Digital A4 // Tomo 01 | Dossier Interactivo | `src/components/public/EvoPublicMagazinesCatalog.tsx` | Selector Magazines -> Edición 01 | COMPLETO | Tomo 01 | VISIBLE | Edición editorial interactiva formato A4 sobre anatomía pericial del silicio y buses. |
| `MAG-02-VIEW` | Magazine Digital A4 // Tomo 02 | Dossier Interactivo | `src/components/tomo02/Tomo02MagazineView.tsx` | Selector Magazines -> Edición 02 | COMPLETO | Tomo 02 | VISIBLE | Edición editorial interactiva sobre auditoría de Kernel NT y servicios en segundo plano. |
| `MAG-03-VIEW` | Magazine Digital A4 // Tomo 03 | Dossier Interactivo | `src/components/tomo03/Tomo03MagazineView.tsx` | Selector Magazines -> Edición 03 | COMPLETO | Tomo 03 | VISIBLE | Edición editorial interactiva sobre diagnóstico y banco de taller. |
| `MAG-04-VIEW` | Magazine Digital A4 // Tomo 04 | Dossier Interactivo | `src/components/tomo04/Tomo04MagazineView.tsx` | Selector Magazines -> Edición 04 | COMPLETO | Tomo 04 | VISIBLE | Edición editorial interactiva sobre reparación de notebooks y fuentes. |
| `MAG-08-VIEW` | Magazine Digital A4 // Tomo 08 | Dossier Interactivo | `src/components/tomo08/Tomo08MagazineView.tsx` | Selector Magazines -> Edición 08 | COMPLETO | Tomo 08 | VISIBLE | Edición editorial interactiva sobre secuencia completa de inicio y arranque. |
| `MAG-PUBLIC-CATALOG` | Catálogo de Magazines Gratuitas | Catálogo Público | `src/components/public/EvoPublicMagazinesCatalog.tsx` | Hub Aprender -> Pestaña MAGAZINES | COMPLETO | Global | VISIBLE | Biblioteca pública de todas las revistas técnicas con acceso directo a sus lectores. |

---

## 10. MOTORES INTERNOS Y SERVICIOS CORE

| ID | NOMBRE | TIPO | ARCHIVO | ESTADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|
| `ENGINE-IDENTITY` | EvoTechnicalIdentityEngine | Servicio / Motor | `src/services/evoTechnicalIdentityEngine.ts` | ACTIVO | OCULTO (LÓGICA) | Modela la identidad técnica, perfil de competencia y trazabilidad del usuario en la plataforma. |
| `ENGINE-EVIDENCE` | EvoEvidenceEngine | Servicio / Motor | `src/services/evoEvidenceEngine.ts` | ACTIVO | OCULTO (LÓGICA) | Certifica la recolección de pruebas experimentales, cálculo de hashes y validación de hallazgos. |
| `ENGINE-FORENSIC` | EvoForensicEngine | Servicio / Motor | `src/services/evoForensicEngine.ts` | ACTIVO | OCULTO (LÓGICA) | Motor de inferencia forense para vincular síntomas de falla con causas raíz comprobables. |
| `ENGINE-CASE` | EvoTechnicalCaseEngine | Servicio / Motor | `src/services/evoTechnicalCaseEngine.ts` | ACTIVO | OCULTO (LÓGICA) | Genera y resuelve árboles de decisión para casos de taller de hardware y software. |
| `ENGINE-METHOD` | EvoMethodEngine | Servicio / Motor | `src/services/evoMethodEngine.ts` | ACTIVO | OCULTO (LÓGICA) | Aplica el rigor del método científico (observación, hipótesis, experimento, conclusión). |
| `ENGINE-SKILL-GRAPH` | EvoSkillGraph | Servicio / Motor | `src/services/evoSkillGraph.ts` | ACTIVO | OCULTO (LÓGICA) | Grafo dirigido de dependencias de conocimiento entre tomos, herramientas y laboratorios. |
| `ENGINE-ADAPTIVE-PATH` | EvoAdaptivePath | Servicio / Motor | `src/services/evoAdaptivePath.ts` | ACTIVO | OCULTO (LÓGICA) | Algoritmo de recomendación que guía al estudiante hacia su siguiente mejor acción formativa. |
| `ENGINE-AUTH-FIREBASE` | Firebase & Auth Integration | Servicio / Auth | `src/services/firebase.ts`, `src/auth/` | ACTIVO | OCULTO (LÓGICA) | Integración con Google Firebase Firestore y autenticación con control de acceso por roles. |
| `ENGINE-AUTH-ACCESS` | EvoAccessContext & Provider | Contexto / RBAC | `src/auth/EvoAccessContext.tsx` | ACTIVO | OCULTO (LÓGICA) | Manejo de suscripciones, compras permanentes de tomos y desbloqueo de permisos comerciales. |

---

## 11. PÁGINAS PÚBLICAS Y COMERCIALES

| ID | NOMBRE | TIPO | ARCHIVO | RUTA | ESTADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|
| `PUB-SHELL` | Shell Pública Unificada | Contenedor Principal | `src/components/public/PublicShell.tsx` | `/` (Modo Público) | COMPLETO | VISIBLE | Envoltorio superior que orquesta el navbar público, secciones activas y pasarela de login. |
| `PUB-NAVBAR` | Barra de Navegación Pública | Componente Header | `src/components/public/PublicNavbar.tsx` | Encabezado público | COMPLETO | VISIBLE | Navegación entre Inicio, Aprender, Laboratorios, Herramientas, Planes y botón de Acceso. |
| `PUB-LANDING` | Landing Page Oficial | Página Principal | `src/components/public/PublicLanding.tsx` | Sección `inicio` | COMPLETO | VISIBLE | Portada institucional con el hero interactivo, propuesta pedagógica y accesos destacados. |
| `PUB-APRENDER-HUB` | Hub "Aprender en EVO LABS" | Página / Hub | `src/components/public/EvoPublicAprenderHub.tsx` | Sección `catalogo` | COMPLETO | VISIBLE | Biblioteca técnica unificada con selector entre los 12 Tomos y las Magazines gratuitas. |
| `PUB-TOMOS-CATALOG` | Catálogo Oficial de 12 Tomos | Catálogo de Productos | `src/components/public/EvoPublicTomosCatalog.tsx` | Sección `catalogo` -> 12 Tomos | COMPLETO | VISIBLE | Grid de los 12 tomos con filtros por área técnica, buscador, tarjetas con hover y modales de detalle. |
| `PUB-LABS-CATALOG` | Catálogo de Laboratorios | Catálogo de Labs | `src/components/public/EvoPublicLabsCatalog.tsx` | Sección `laboratorios` | COMPLETO | VISIBLE | Listado detallado de todos los laboratorios y bancos interactivos disponibles en el campus. |
| `PUB-TOOLS-CATALOG` | Catálogo de 34 Herramientas | Catálogo de Tools | `src/components/public/EvoPublicToolsCatalog.tsx` | Sección `herramientas` | COMPLETO | VISIBLE | Directorio completo de las 34 herramientas de diagnóstico, medición, investigación y reparación. |
| `PUB-PRICING` | Precios y Planes Comerciales | Pasarela Comercial | `src/components/public/EvoPublicPricing.tsx` | Sección `planes` | COMPLETO | VISIBLE | Comparativa de Plan Gratis (Demo), Compra Permanente por Tomo y Suscripción EVO Complete. |
| `PUB-HOW-TO-USE` | Guía de Uso del Ecosistema | Página Informativa | `src/components/public/EvoPublicHowToUse.tsx` | Modal / Ruta | COMPLETO | VISIBLE | Instrucciones para sacar el máximo rendimiento del método pericial de EVO LABS. |
| `COM-ORDER-SUMMARY` | Resumen de Orden de Compra | Modal Comercial | `src/components/commerce/EvoOrderSummaryModal.tsx` | Al iniciar compra | COMPLETO | VISIBLE | Desglose de ítems, precio en ARS/USD y botón de confirmación de pago. |
| `COM-PLAN-CONFIG` | Configurador de Planes | Modal Comercial | `src/components/commerce/EvoPlanConfiguratorModal.tsx` | Selector de plan | COMPLETO | VISIBLE | Configuración personalizada de suscripción anual/mensual o tomos individuales. |
| `COM-PAYMENT-SUCCESS` | Vista de Pago Exitoso | Página de Agradecimiento | `src/components/commerce/EvoPaymentSuccessView.tsx` | `/payment/success` o `?order_id` | COMPLETO | VISIBLE | Confirmación de compra aprobada, activación de permisos y botón de ingreso al campus. |
| `COM-PAYWALL-MODAL` | Modal de Bloqueo por Paywall | Modal de Venta | `src/components/common/EvoPaywallModal.tsx` | Al intentar abrir contenido bloqueado | COMPLETO | VISIBLE | Alerta informativa de requerimiento de suscripción EVO Complete o compra permanente. |

---

## 12. RUTAS Y MÓDULOS DEL CAMPUS PRIVADO

| ID | NOMBRE | TIPO | ARCHIVO | RUTA / TRIGGER | ESTADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|---|
| `CAMPUS-WORLD-MAP` | Mapa del Mundo EVO (Campus) | Vista Principal Privada | `src/components/world/EvoWorldMap.tsx` | `currentView: world-map` | COMPLETO | VISIBLE | Mapa interactivo del campus de ingeniería con zonas de laboratorio, tomos y accesos rápidos. |
| `CAMPUS-HOME-EXP` | Experiencia Home Privada | Vista de Bienvenida | `src/components/home/EvoHomeExperience.tsx` | `currentView: world-map` (Sección inicio) | COMPLETO | VISIBLE | Tablero con tarjetas comerciales de tomos, estadísticas de actividad y accesos prioritarios. |
| `CAMPUS-TOP-NAV` | Cabecera Unificada Shell | Componente Header | `src/components/navigation/EvoUnifiedHeaderShell.tsx` | Cabecera privada | COMPLETO | VISIBLE | Barra superior con selección de sección, selector de Tomo rápido, expediente y botón de salida. |
| `CAMPUS-SIDE-NAV` | Barra de Navegación Lateral | Componente Sidebar | `src/components/navigation/EvoSidebarNav.tsx` | Lateral de lectura | COMPLETO | VISIBLE | Menú vertical colapsable para transitar entre capítulos del Tomo en curso. |

---

## 13. COMPONENTES OCULTOS, TEMPLATES Y UTILIDADES INTERNAS

| ID | NOMBRE | TIPO | ARCHIVO | ESTADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|
| `AUTH-FACTORY` | Fábrica de Contenido Curricular | Framework de Autoría | `src/authoring/factory.ts` | ACTIVO | OCULTO | Motor de instanciación de nuevos capítulos, casos y pruebas según el esquema estandarizado EVO. |
| `AUTH-SCHEMA` | Esquema de Validación de Casos | Esquema TypeScript | `src/authoring/schema.ts` | ACTIVO | OCULTO | Definición de tipos formales para capítulos editoriales, evaluaciones y laboratorios. |
| `AUTH-VALIDATOR` | Validador de Calidad Pedagógica | Validador | `src/authoring/validator.ts` | ACTIVO | OCULTO | Revisa que ningún contenido nuevo viole las reglas de rigor científico o carezca de pruebas. |
| `TMPL-CASE` | Template de Caso Técnico | Plantilla React | `src/authoring/templates/EvoTechnicalCaseTemplate.tsx` | ACTIVO | OCULTO | Plantilla reutilizable para renderizar casos de diagnóstico en taller. |
| `TMPL-EVIDENCE` | Template de Resultado de Evidencia | Plantilla React | `src/authoring/templates/EvoEvidenceResultTemplate.tsx` | ACTIVO | OCULTO | Plantilla para expedir comprobantes de medición y pasaportes de evidencia. |
| `TMPL-LAB` | Template de Laboratorio Interactivo | Plantilla React | `src/authoring/templates/EvoInteractiveLabTemplate.tsx` | ACTIVO | OCULTO | Molde estándar para construir nuevos laboratorios periciales en el framework. |
| `TMPL-EDITORIAL` | Template de Capítulo Editorial | Plantilla React | `src/authoring/templates/EvoEditorialChapterTemplate.tsx` | ACTIVO | OCULTO | Estructura base para capítulos teóricos de alta legibilidad con notas al pie y figuras. |
| `TMPL-ASSESSMENT` | Template de Evaluación | Plantilla React | `src/authoring/templates/EvoAssessmentTemplate.tsx` | ACTIVO | OCULTO | Estructura estándar para cuestionarios y desafíos de resolución práctica. |
| `MODAL-CONTENT-FACTORY` | Modal de Fábrica de Contenido | Modal UI | `src/components/common/EvoContentFactoryModal.tsx` | ACTIVO | OCULTO (DISPATCH) | Modal activable por evento de sistema para generar dinámicamente ejercicios y casos. |
| `MODAL-TRANSFER-CHALLENGE` | Modal de Desafíos de Transferencia | Modal UI | `src/components/common/EvoTransferChallengeModal.tsx` | ACTIVO | OCULTO (DISPATCH) | Retos de resolución situacional para validar si el alumno sabe aplicar lo aprendido en campo. |
| `MODAL-FORENSIC-REPORT` | Modal de Reporte Forense | Modal UI | `src/components/common/EvoForensicReportModal.tsx` | ACTIVO | OCULTO (DISPATCH) | Genera informes técnicos en formato imprimible con dictamen y sellos de aprobación. |
| `MODAL-WHY-THIS` | Modal "Por qué este procedimiento" | Modal Educativo | `src/components/common/EvoWhyThisModal.tsx` | ACTIVO | OCULTO (DISPATCH) | Justificación epistemológica y física de por qué se exige determinado paso pericial. |
| `MODAL-COVERAGE-DASHBOARD` | Dashboard de Cobertura Curricular | Dashboard | `src/components/evoLabCore/components/CatalogCoverageDashboard.tsx` | ACTIVO | OCULTO (DISPATCH) | Matriz que correlaciona qué tomos cubren cada una de las 34 herramientas de la plataforma. |
| `MODAL-COMPAT-GRAPH` | Grafo de Compatibilidad de Componentes | Visualizador de Grafo | `src/components/evoLabCore/components/EvoCompatibilityGraphModal.tsx` | ACTIVO | OCULTO (DISPATCH) | Analizador de compatibilidad eléctrica y dimensional entre zócalos, fuentes y tarjetas. |

---

## 14. ASSETS PRINCIPALES E IDENTIDAD DE MARCA

| ID | NOMBRE | TIPO | ARCHIVO / RUTA | ESTADO | VISIBLE/OCULTO | DESCRIPCIÓN DE SU FUNCIÓN |
|---|---|---|---|---|---|---|
| `ASSET-LOGO-PREMIUM` | Logo Oficial 3D EVO LABS | Imagen PNG Transparente | `public/branding/evo-logo-premium.png` | ACTIVO | VISIBLE | Emblema hexagonal 3D de alta definición en oro y plata con la tipografía "EVO LABS" y fondo transparente. |
| `ASSET-BRANDMARK-COMP` | Componente Evo3DBrandMark | Componente React | `src/components/branding/Evo3DBrandMark.tsx` | ACTIVO | VISIBLE | Renderizador estático, sin marcos ni recortes, del logo oficial en el hero principal. |
| `ASSET-COVER-TOMO-01` | Portada Oficial Tomo 01 | Imagen JPG | `public/covers/tomo-01.jpg` | ACTIVO | VISIBLE | Portada editorial realista del Tomo 01: PC de escritorio, gabinete abierto y hardware real. |
| `ASSET-COVER-TOMO-02` | Portada Oficial Tomo 02 | Imagen JPG | `public/covers/tomo-02.jpg` | ACTIVO | VISIBLE | Portada editorial de "La Biblia Negra de Windows" con el logo de Windows y estética oscura. |
| `ASSET-COVER-TOMO-03` | Portada Oficial Tomo 03 | Imagen JPG | `public/covers/tomo-03.jpg` | ACTIVO | VISIBLE | Portada de Reparación de PC: banco de herramientas y hardware en prueba. |
| `ASSET-COVER-TOMO-04` | Portada Oficial Tomo 04 | Imagen JPG | `public/covers/tomo-04.jpg` | ACTIVO | VISIBLE | Portada de Reparación de Notebooks: taller de microelectrónica. |
| `ASSET-COVER-TOMO-05` | Portada Oficial Tomo 05 | Imagen JPG | `public/covers/tomo-05.jpg` | ACTIVO | VISIBLE | Portada de Redes: interconexiones y fibra óptica. |
| `ASSET-COVER-TOMO-06` | Portada Oficial Tomo 06 | Imagen JPG | `public/covers/tomo-06.jpg` | ACTIVO | VISIBLE | Portada de Ciberseguridad: taller y laboratorio defensivo. |
| `ASSET-COVER-TOMO-07` | Portada Oficial Tomo 07 | Imagen JPG | `public/covers/tomo-07.jpg` | ACTIVO | VISIBLE | Portada de Rendimiento: escultura geométrica de silicio y hardware. |
| `ASSET-COVER-TOMO-08` | Portada Oficial Tomo 08 | Imagen JPG | `public/covers/tomo-08.jpg` | ACTIVO | VISIBLE | Portada de Arranque y Diagnóstico: placa madre y secuencia de encendido. |
| `ASSET-COVER-TOMO-09` | Portada Oficial Tomo 09 | Imagen JPG | `public/covers/tomo-09.jpg` | ACTIVO | VISIBLE | Portada de Programación: pistas de circuitos lógicos y código. |
| `ASSET-COVER-TOMO-10` | Portada Oficial Tomo 10 | Imagen JPG | `public/covers/tomo-10.jpg` | ACTIVO | VISIBLE | Portada de Prompt e IA: arquitectura neuronal y transformadores. |
| `ASSET-HERO-SILICON` | Fotografía Macro de Silicio | Imagen JPG | `src/assets/images/evo_silicon_hero_1789530430709.jpg` | ACTIVO | VISIBLE | Fotografía de microscopía y sustrato de silicio para el hero editorial contemporáneo. |
| `ASSET-HERO-SCULPTURE` | Escultura de Hardware Hero | Imagen JPG | `src/assets/images/hardware_sculpture_hero_1789530888503.jpg` | ACTIVO | VISIBLE | Arte editorial de ingeniería para módulos de metrología. |
| `ASSET-PCB-TRACES` | Detalle Macro de Pistas PCB | Imagen JPG | `src/assets/images/pcb_traces_detail_1789530447414.jpg` | ACTIVO | VISIBLE | Textura de precisión para placas y diagramas circuitales. |

---

*Fin del Master Manifest Canónico de EVO LABS. Este archivo es inmutable sin aprobación directa del Owner.*
