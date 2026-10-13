# EVO LABS // AUDITORÍA PERICIAL INTEGRAL DE CONTENIDO
**Fecha:** 2026-10-09  
**Estado del Repositorio:** 181/181 checks anti-regresión superados (`npm run evo:regression`)  
**Compilación TypeScript:** 0 errores (`npx tsc --noEmit`)  
**Build:** Producción operativo (`npm run build`)  

---

## 1. RESUMEN EJECUTIVO

Se ejecutó una auditoría exhaustiva y no destructiva sobre la totalidad del proyecto **Magazine-EvoLabs**.  
El análisis abarca:
- **12 Tomos Canónicos** (estructura, capítulos, páginas, casos y glosarios).
- **Formatos de Lectura** (Magazines A4 editoriales vs. Technical Readers).
- **8 Zonas del Campus** (`src/components/world/labs/`).
- **10 Laboratorios Especializados** (`src/components/labs/`, `src/components/tomo08/`, etc.).
- **34 Herramientas Técnicas Canónicas** (`src/data/evoToolsData.ts`).
- **12 Bancos de Examen Oficiales** (`src/components/exam/data/`).
- **Motores de Simulación y Telemetría** (`EvoLabCore`, `Digital Twin`, `Ultimate Sandbox`).
- **Tutor EVO y Rutas de Aprendizaje** (`src/components/tutor/`, `src/data/evoLearningPaths.ts`).

---

## 2. INVENTARIO COMPLETO DE LOS 12 TOMOS

| Tomo | Título Canónico | Formato de Lectura Principal | Capítulos / Módulos | Casos Prácticos | Preguntas Examen | Archivo de Datos | Componente Vista Principal |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **01** | **Conocé tu PC** (Hardware, buses y arquitectura física) | Magazine A4 (46 págs) + Capítulos Interactivos | 7 Capítulos (8 estaciones en C01, sub-estaciones en C02-C07) | 12 Dossiers de Taller | 30 preguntas | `src/data/collections.ts` | `src/components/magazine/EvoMagazineView.tsx` & `Chapter01View.tsx`-`Chapter07View.tsx` |
| **02** | **La Biblia Negra de Windows** (Kernel NT, servicios, procesos) | Magazine A4 (38 págs / 67 págs PDF) + 11 Sectores | 40 Sectores Maestros / 30 Módulos | 4 Casos Clínicos + Mini-casos | 30 preguntas | `src/data/tomo02Data.ts` & `src/data/tomo02MasterSectors.ts` | `src/components/tomo02/Tomo02MagazineView.tsx` & `Tomo02ModuleReader.tsx` |
| **03** | **Reparación de PC** (Diagnóstico pericial y banco de taller) | Magazine A4 (43 págs) | 35 Módulos de Taller | 3 Casos de Taller | 30 preguntas | `src/data/tomo03Data.ts` | `src/components/tomo03/Tomo03MagazineView.tsx` |
| **04** | **Reparación de Notebooks** (Microelectrónica y esquemáticos) | Magazine A4 (33 págs) | 33 Módulos de Notebook | 3 Casos de Taller | 15 preguntas | `src/data/tomo04Data.ts` | `src/components/tomo04/Tomo04MagazineView.tsx` |
| **05** | **Redes** (TCP/IP, direccionamiento y tráfico) | Technical Tome Reader | 7 Capítulos (3 capas) | 4 Casos de Estudio | 15 preguntas | `src/data/tomo05Data.ts` | `src/components/tomo05/Tomo05MasterPage.tsx` |
| **06** | **Ciberseguridad** (Defensa perimetral y hardening) | Technical Tome Reader | 7 Capítulos (3 capas) | 3 Casos Forenses | 15 preguntas | `src/data/tomo06Data.ts` | `src/components/tomo06/Tomo06MasterPage.tsx` |
| **07** | **Gaming Pro / Rendimiento** (Metrología de frametimes y latencia) | Technical Tome Reader | 7 Capítulos (3 capas) | 3 Casos de Metrología | 15 preguntas | `src/data/tomo07Data.ts` | `src/components/tomo07/Tomo07MasterPage.tsx` |
| **08** | **Arranque y Diagnóstico** (Secuencia POST y 35 estados) | Magazine A4 (16 págs) + Boot Lab | 10 Módulos de Arranque | 4 Casos de Encendido | 15 preguntas | `src/data/tomo08Data.ts` & `bootSequenceData.ts` | `src/components/tomo08/Tomo08MagazineView.tsx` & `EvoBootLab.tsx` |
| **09** | **Programación desde Cero** (Lógica y pensamiento computacional) | Technical Tome Reader | 7 Capítulos (3 capas) | 3 Casos de Automatización | 15 preguntas | `src/data/tomo09Data.ts` | `src/components/tomo09/Tomo09MasterPage.tsx` |
| **10** | **Prompt e IA Avanzada** (LLMs, RAG y agentes) | Technical Tome Reader | 5 Capítulos (3 capas) | 5 Casos de Estudio RAG | 15 preguntas | `src/data/tomo10Data.ts` | `src/components/tomo10/Tomo10MasterPage.tsx` |
| **11** | **Electrónica Aplicada a la Informática** (Física, VRM y componentes) | Technical Tome Reader + Lab Hub | 5 Capítulos (3 capas) | 2 Casos de Estudio | **3 preguntas (INCOMPLETO)** | `src/data/tomo11Data.ts` | `src/components/tomo11/Tomo11MasterPage.tsx` |
| **12** | **Ingeniería y Creación de Videojuegos** (EVO Game Forge) | Technical Tome Reader + Game Forge Studio | 5 Capítulos (3 capas) | 2 Casos de Game Loop | **3 preguntas (INCOMPLETO)** | `src/data/tomo12Data.ts` | `src/components/tomo12/Tomo12MasterPage.tsx` |

---

## 3. INVENTARIO DE LABORATORIOS Y SIMULADORES

### 3.1. Laboratorios de Campus (8 Zonas Canónicas)
Ruta física: `src/components/world/labs/`

1. **Zona 01 — Central de Incidentes (`Lab01CentralIncidentes.tsx`):**  
   - Líneas de código: 708.  
   - Funcionalidad: Decodificador analítico de volcados de memoria y BSODs (`DPC_WATCHDOG_VIOLATION`, `IRQL_NOT_LESS_OR_EQUAL`, `PAGE_FAULT_IN_NONPAGED_AREA`, `WHEA_UNCORRECTABLE_ERROR`, `KERNEL_SECURITY_CHECK_FAILURE`). Muestra registros de CPU (RAX, RBX, RIP), trap frames y árbol de causa raíz.
   - Estado: **Real y Operativo**.

2. **Zona 02 — Taller de Rendimiento (`Lab02TallerRendimiento.tsx`):**  
   - Líneas de código: 616.  
   - Funcionalidad: Simulador de micro-stuttering, percentiles 1% low y 0.1% low, curvas de ventiladores y niveles de presión sonora (dBA), más integración de sub-paneles de Hot-Swap.
   - Estado: **Real y Operativo**.

3. **Zona 03 — Archivo EVO (`Lab03ArchivoEvo.tsx`):**  
   - Líneas de código: 187.  
   - Funcionalidad: Bóveda de consulta editorial.
   - Deficiencia identificada: **Solo expone 4 tomos de los 12**. Muestra únicamente tarjetas para Tomos 01 a 04 con el subtítulo "4 VOLÚMENES EDITORIALES".
   - Estado: **Incompleto (omite Tomos 05 al 12)**.

4. **Zona 04 — Cámara de Experimentos (`Lab04CamaraExperimentos.tsx`):**  
   - Líneas de código: 348.  
   - Funcionalidad: Banco de ensayos comparativos A/B con validación de significancia estadística (Delta de FPS, dispersión de frametime, temporizadores `NtSetTimerResolution`, etc.).
   - Estado: **Real y Operativo**.

5. **Zona 05 — Sala de Máquinas (`Lab05SalaMaquinas.tsx`):**  
   - Líneas de código: 274.  
   - Funcionalidad: Colección de scripts interactivos de PowerShell para diagnóstico forense real (volcado de SPD y topología DRAM, análisis de interrupciones MSI vs Line-Based IRQ, salud de WinSxS).
   - Estado: **Real y Operativo**.

6. **Zona 06 — Zona Restringida (`Lab06ZonaRestringida.tsx`):**  
   - Líneas de código: 360.  
   - Funcionalidad: Expedientes forenses de misterio con árbol de decisión y descarte pericial (fuga térmica en VRM por PWM excesivo, saturación de cola ISR a 8000 Hz).
   - Estado: **Real y Operativo**.

7. **Zona 07 — Mi Laboratorio (`Lab07MiLaboratorio.tsx`):**  
   - Líneas de código: 199.  
   - Funcionalidad: Hangar de flota multi-máquina, historial de degradación reológica de pastas térmicas y ciclo de mantenimiento.
   - Estado: **Real y Operativo**.

8. **Zona 08 — Comunidad EVO (`Lab08ComunidadEvo.tsx`):**  
   - Líneas de código: 124.  
   - Funcionalidad: Radar global de telemetría de controladores y alertas de inestabilidad de drivers (NVIDIA, AMD, Intel Killer).
   - Estado: **Real y Operativo**.

### 3.2. Laboratorios Especializados por Tomo
- **Tomo 01 — Hardware Hot-Swap & Motherboard Canvas (`EvoMasterLabSuite.tsx` / `EvoMotherboardCanvas.tsx`):**  
  Intercambio interactivo de CPU, RAM, VRM, Chipset, buses PCIe y M.2 con animación de paquetes y cálculo físico de latencia en nanosegundos.
- **Tomo 02 — Windows Matrix Lab & X-Ray (`EvoWindowsMatrixLab.tsx` / `EvoWindowsXRayLab.tsx`):**  
  Auditoría de servicios de Windows, telemetría, resolución de incidentes de arranque e inspección de privilegios Ring 0 / Ring 3.
- **Tomo 05 — Network Forensics Lab (`src/components/labs/tomo05/EvoNetworkForensicsLab.tsx` — 67 kB):**  
  Simulador de análisis de paquetes, captura tipo Wireshark, inspección de cabeceras TCP/IP y cálculo de máscaras CIDR.
- **Tomo 06 — Defensive Security Lab (`src/components/labs/tomo06/EvoDefensiveSecurityLab.tsx` — 51 kB):**  
  Matriz interactiva MITRE ATT&CK, simulador de detección y contención de ransomware y auditoría de directivas de seguridad.
- **Tomo 07 — Performance Metrology Lab (`src/components/labs/tomo07/EvoPerformanceMetrologyLab.tsx` — 52 kB):**  
  Instrumento de medición de frametimes en ms, percentiles 1% low y diagnóstico de desincronización de refresco de pantalla.
- **Tomo 08 — Boot Sequence Lab (`src/components/tomo08/EvoBootLab.tsx` — 71 kB / `EvoBootMachineVisual.tsx` — 106 kB):**  
  Laboratorio interactivo de 35 etapas de encendido POST, señales eléctricas ATX (5VSB, PS_ON#, PWR_OK), códigos hexadecimales de depuración y multímetro virtual.
- **Tomo 09 — Code Engineering Lab (`src/components/labs/tomo09/EvoCodeEngineeringLab.tsx` — 43 kB):**  
  Simulador de ejecución y análisis de complejidad algorítmica y control de flujo.
- **Tomo 10 — AI Systems Lab (`src/components/labs/tomo10/EvoAiSystemsLab.tsx` — 44 kB):**  
  Simulador de fragmentación de tokens, ventanas de contexto y arquitectura de embeddings vectoriales.
- **Tomo 11 — Electronics Lab Hub (`src/components/tomo11/Tomo11MasterPage.tsx`):**  
  Simulador de multímetro en modos voltaje, resistencia y diodo con pruebas de cortocircuito en rieles de standby y VCore.
- **Tomo 12 — Game Forge Studio (`src/components/game-forge/GameForgeStudio.tsx` & `MundoMaxProject.tsx`):**  
  Entorno de arquitectura de motores de juego, game loops y simulaciones con delta time ($dt$).

### 3.3. Simuladores Independientes y Herramientas del Núcleo
- `src/components/tools/EvoLatencyCalculator.tsx`: Calculadora matemática de latencia absoluta en nanosegundos basada en MT/s y CAS Latency (CL).
- `src/components/tools/EvoPcBuildArchitect.tsx`: Arquitecto de balanceo de componentes y presupuestos.
- `src/components/evoLabCore/EvoLabCore.tsx`: Suite completa de 6 fases operativas (Selección, Armado, Reparación, Test de Estrés, Optimización y Actualización).

---

## 4. INVENTARIO DE LAS 34 HERRAMIENTAS TÉCNICAS
Definidas en `src/data/evoToolsData.ts` y mapeadas en `TOOL_TARGET_MAP` (`src/App.tsx`):

1. `diag-boot-seq` → `boot-lab` (Tomo 08)
2. `diag-bsod-decoder` → `windows-matrix-lab` (`crash-repair`)
3. `diag-incident-events` → `windows-matrix-lab` (`services`)
4. `diag-bottleneck-calc` → `lab-core` (`BOTTLENECK`)
5. `diag-autodetect-pc` → `world-map` (`diagnosticar`) + Evento `evo_open_autodetect` **[INACCESIBLE POR FALTA DE LISTENER]**
6. `diag-telemetry-integrity` → Modal `EvoTelemetryIntegrityModal`
7. `diag-atx-power-bench` → `lab-core` (`REPAIR`)
8. `diag-case-resolver` → `world-map` (`diagnosticar`) + Evento `evo_open_case_resolver` **[INACCESIBLE POR FALTA DE LISTENER]**
9. `med-latency-calc` → `hotswap-lab` (`hardware`)
10. `med-frametime-analyzer` → `hotswap-lab` (`telemetry`)
11. `med-sensors-telemetry` → `hotswap-lab` (`telemetry`)
12. `med-dpc-latency` → `windows-matrix-lab` (`services`)
13. `med-stress-stability` → `lab-core` (`TEST`)
14. `med-thermal-history` → `hotswap-lab` (`telemetry`)
15. `inv-pcb-schematic` → `hotswap-lab` (`hardware`)
16. `inv-xray-kernel` → `windows-xray-lab` (`xray`)
17. `inv-cache-imc-flow` → `hotswap-lab` (`hardware`)
18. `inv-digital-twin` → `world-map` (`diagnosticar`) + Evento `evo_open_digital_twin` **[INACCESIBLE POR FALTA DE LISTENER]**
19. `inv-workstations-sectors` → `hotswap-lab` (`all`)
20. `inv-coverage-matrix` → Modal `CatalogCoverageDashboard`
21. `rep-windows-repair` → `windows-matrix-lab` (`repair`)
22. `rep-windows-install` → `windows-matrix-lab` (`install`)
23. `rep-hotswap-bench` → `hotswap-lab` (`sandbox`)
24. `rep-core-repair-view` → `lab-core` (`REPAIR`)
25. `opt-nt-services` → `windows-matrix-lab` (`services`)
26. `opt-core-optimization` → `lab-core` (`OPTIMIZE`)
27. `opt-ab-comparison` → `hotswap-lab` (`sandbox`)
28. `opt-upgrade-simulator` → `lab-core` (`UPGRADE`)
29. `opt-build-architect` → `lab-core` (`BUILD_PC`)
30. `doc-forensic-dossier` → `world-map` (`diagnosticar`) + Evento `evo_open_forensic_report` **[INACCESIBLE POR FALTA DE LISTENER]**
31. `doc-evidence-passport` → Modal `EvoHardwareDiscoveryModal`
32. `doc-technical-dossier` → `world-map` (`diagnosticar`) + Evento `evo_open_forensic_report` **[INACCESIBLE POR FALTA DE LISTENER]**
33. `doc-content-factory` → `world-map` (`diagnosticar`) + Evento `evo_open_content_factory` **[INACCESIBLE POR FALTA DE LISTENER]**
34. `doc-transfer-challenge` → `world-map` (`diagnosticar`) + Evento `evo_open_transfer_challenge` **[INACCESIBLE POR FALTA DE LISTENER]**

---

## 5. INVENTARIO DE BANCOS DE EXAMEN

Motor principal: `src/components/exam/EvoTomeExamEngine.tsx`  
Registro centralizado: `src/components/exam/data/index.ts` (`ALL_EXAM_BANKS`)

- `tomo01ExamData.ts`: **30 preguntas** (completo, casos de taller, gráficos y secuencias).
- `tomo02ExamData.ts`: **30 preguntas** (completo, Ring 0, DPC/ISR, SysMain, WinSxS).
- `tomo03ExamData.ts`: **30 preguntas** (completo, fuentes ATX, multímetro, VRM, descarte).
- `tomo04ExamData.ts`: **15 preguntas** (completo, circuitos de carga, KBC/EC, boardviews).
- `tomo05ExamData.ts`: **15 preguntas** (completo, TCP/IP, subredes, switches, MTU).
- `tomo06ExamData.ts`: **15 preguntas** (completo, CIA triad, MITRE ATT&CK, hardening).
- `tomo07ExamData.ts`: **15 preguntas** (completo, frametimes, 1% low, latencia DPC).
- `tomo08ExamData.ts`: **15 preguntas** (completo, secuencia POST, Power Good, UEFI).
- `tomo09ExamData.ts`: **15 preguntas** (completo, algoritmos, complejidad, depuración).
- `tomo10ExamData.ts`: **15 preguntas** (completo, tokens, embeddings, RAG, prompt injection).
- `tomo11ExamData.ts`: **3 preguntas** ⚠️ **[DEFICIENCIA CRÍTICA: TRUNCADO]**.
- `tomo12ExamData.ts`: **3 preguntas** ⚠️ **[DEFICIENCIA CRÍTICA: TRUNCADO]**.

---

## 6. LAS 10 PÉRDIDAS O DEFICIENCIAS MÁS IMPORTANTES (ORDENADAS POR PRIORIDAD)

### 🔴 PRIORIDAD 1: Truncamiento crítico en los Bancos de Examen de Tomo 11 y Tomo 12
- **Archivos afectados:**
  - `src/components/exam/data/tomo11ExamData.ts` (3 preguntas)
  - `src/components/exam/data/tomo12ExamData.ts` (3 preguntas)
- **Impacto:**  
  Mientras los Tomos 01 al 03 disponen de 30 preguntas y los Tomos 04 al 10 disponen de 15 preguntas, los Tomos 11 y 12 solo cuentan con 3 preguntas cada uno. Un examen de 3 preguntas no permite una evaluación pericial seria ni valida adecuadamente los 5 capítulos teóricos existentes en cada tomo.
- **Causa raíz:** Datos de examen incompletos introducidos durante la fase de inicialización.

---

### 🔴 PRIORIDAD 2: Desconexión e inaccesibilidad funcional de 6 herramientas canónicas por falta de Listeners
- **Archivos afectados:**
  - `src/App.tsx` (Líneas 143, 158, 202, 255, 272, 279)
  - `src/utils/evoToolRouter.ts` (Líneas 65, 95, 163, 249, 282, 294)
  - `src/components/world/EvoWorldMap.tsx`
- **Impacto:**  
  Al hacer clic en las herramientas `diag-autodetect-pc`, `diag-case-resolver`, `inv-digital-twin`, `doc-forensic-dossier`, `doc-content-factory` y `doc-transfer-challenge`, el enrutador ejecuta `window.dispatchEvent(new CustomEvent('evo_open_...'))`. Sin embargo, en ningún archivo de la aplicación existe un `window.addEventListener` para capturar estos eventos. El usuario aterriza en el mapa general de campus pero el modal de la herramienta solicitada jamás se abre automáticamente.
- **Causa raíz:** Emisión de eventos desacoplada sin suscripción en el componente receptor (`EvoWorldMap.tsx`).

---

### 🔴 PRIORIDAD 3: Ausencia de Tomo 11 y Tomo 12 en `EvoTomoDossierModal.tsx` con fallback erróneo al Tomo 01
- **Archivo afectado:**
  - `src/components/common/EvoTomoDossierModal.tsx` (Líneas 78-450 y 1071)
- **Impacto:**  
  El diccionario `TOMOS_EDITORIAL_COVERS` solo contempla claves desde `'tomo-01'` hasta `'tomo-10'`. Cuando el usuario intenta abrir la ficha o dossier de los Tomos 11 o 12, el código ejecuta:
  ```typescript
  const coverMeta = TOMOS_EDITORIAL_COVERS[resolvedTomoId] || TOMOS_EDITORIAL_COVERS['tomo-01'];
  ```
  Esto provoca que al hacer clic en el Tomo 11 o 12 se visualice la carátula, tópicos y especificaciones del **Tomo 01: Conocé tu PC**.
- **Causa raíz:** Omitidas las entradas de metadatos editoriales para los tomos 11 y 12 al expandir la colección de 10 a 12 tomos.

---

### 🔴 PRIORIDAD 4: Discrepancia temática en los nombres de Tomo 11 y Tomo 12 en los Paywalls de `App.tsx`
- **Archivo afectado:**
  - `src/App.tsx` (Líneas 1774 y 1790)
- **Impacto:**  
  En las pantallas de bloqueo comercial (`EvoContentGate`):
  - Línea 1774: Rotulado erróneamente como `title="Tomo 11 // Peritaje Judicial Informático"`, cuando el título canónico es **"Electrónica Aplicada a la Informática"**.
  - Línea 1790: Rotulado erróneamente como `title="Tomo 12 // Laboratorio Maestro e Innovación"`, cuando el título canónico es **"Ingeniería y Creación de Videojuegos // EVO Game Forge"**.
- **Causa raíz:** Copia residual de borradores de catálogo previos a la unificación canónica de `src/data/evoCatalog.ts`.

---

### 🟠 PRIORIDAD 5: Asimetría estructural de formato editorial (Ausencia de Revista A4 en Tomos 05, 06, 07, 09, 10, 11, 12)
- **Archivos afectados:**
  - `src/components/tomo05/Tomo05MagazineView.tsx` (11 líneas)
  - `src/components/tomo06/Tomo06MagazineView.tsx` (11 líneas)
  - `src/components/tomo07/Tomo07MagazineView.tsx` (11 líneas)
  - `src/components/tomo09/Tomo09MagazineView.tsx` (11 líneas)
  - `src/components/tomo10/Tomo10MagazineView.tsx` (11 líneas)
  - `src/components/tomo11/Tomo11MagazineView.tsx` (11 líneas)
  - `src/components/tomo12/Tomo12MagazineView.tsx` (11 líneas)
- **Impacto:**  
  Los Tomos 01, 02, 03, 04 y 08 tienen una revista editorial multipágina completa construida para formato físico A4 e impresión PDF. En cambio, los Tomos 05, 06, 07, 09, 10, 11 y 12 solo disponen de un wrapper genérico que reenvía a `EvoTechnicalTomeReader.tsx`. Estos archivos `TomoXXMagazineView.tsx` no son verdaderos magazines editoriales A4.
- **Causa raíz:** Implementación asimétrica entre los primeros tomos editoriales y los tomos posteriores orientados a lector técnico digital.

---

### 🟠 PRIORIDAD 6: La Zona 03 del Campus (`Lab03ArchivoEvo.tsx`) solo expone 4 de los 12 Tomos
- **Archivo afectado:**
  - `src/components/world/labs/Lab03ArchivoEvo.tsx` (Líneas 34 y 57-181)
- **Impacto:**  
  La Bóveda Editorial y Archivo Maestro de la academia indica textualmente: `"// 4 VOLÚMENES EDITORIALES"` y solo presenta tarjetas para los Tomos 01, 02, 03 y 04. Los Tomos 05 al 12 están completamente ausentes de la interfaz física de esta zona del campus.
- **Causa raíz:** El componente quedó fijado a la versión histórica inicial cuando solo existían 4 tomos redactados.

---

### 🟠 PRIORIDAD 7: Desincronización del catálogo en Tutor EVO (`tutorAcademyData.ts`)
- **Archivo afectado:**
  - `src/components/tutor/data/tutorAcademyData.ts` (Líneas 30-31)
- **Impacto:**  
  El asistente Tutor EVO explica al usuario que la academia cuenta con `"Los 10 volúmenes temáticos de la biblioteca técnica"` y enumera una lista desactualizada que no incluye IA/Prompting ni Creación de Videojuegos, contradiciendo la presencia de los 12 tomos canónicos.
- **Causa raíz:** Glosario y datos de inducción del Tutor sin actualizar tras la adición de los Tomos 11 y 12.

---

### 🟡 PRIORIDAD 8: Inexistencia de rutas directas para Exámenes de Tomos 02 a 12 en `App.tsx`
- **Archivo afectado:**
  - `src/App.tsx` (Línea 435 y bloque 2113-2160)
- **Impacto:**  
  `currentView` únicamente contempla `'tomo01-quiz'`. Para los Tomos 02 al 12, los exámenes no pueden invocarse directamente como vistas de nivel superior de la aplicación; están subordinados a ser abiertos mediante estados internos de modales dentro de sus respectivos lectores.
- **Causa raíz:** Arquitectura de vistas monocéntrica en el Tomo 01, no extendida al resto de la colección en el router raíz de `App.tsx`.

---

### 🟡 PRIORIDAD 9: Falso estado "EN DESARROLLO" en metadatos para laboratorios existentes y funcionales
- **Archivos afectados:**
  - `src/data/evoLearningPaths.ts` (Líneas 164, 196, 229, 261, 293, 326, 359)
  - `src/components/common/EvoTomoDossierModal.tsx` (Líneas 329, 411, 452)
- **Impacto:**  
  En las rutas de aprendizaje de `evoLearningPaths.ts`, los laboratorios de los Tomos 05, 06, 07, 09 y 10 tienen el metadato `associatedLabStatus: 'EN DESARROLLO'`. Sin embargo, `EvoNetworkForensicsLab.tsx`, `EvoDefensiveSecurityLab.tsx`, `EvoPerformanceMetrologyLab.tsx`, `EvoCodeEngineeringLab.tsx` y `EvoAiSystemsLab.tsx` están 100% programados y operativos. Esta discrepancia confunde la visualización de progreso y catálogos.
- **Causa raíz:** Falta de sincronización de flags de estado al integrarse los laboratorios especializados.

---

### 🟡 PRIORIDAD 10: Componentes de reenvío redundantes y numeración duplicada en el Magazine del Tomo 01
- **Archivos afectados:**
  - `src/components/magazine/Page03Index.tsx` (7 líneas — reenvía a `Page07Index.tsx`)
  - `src/components/magazine/Page12BackCover.tsx` (7 líneas — reenvía a `Page46BackCover.tsx`)
- **Impacto:**  
  Genera dispersión en el árbol de componentes de `src/components/magazine/`. `Page03Index` no es la página 3 (la pág 3 es `Page03PactoLector`) ni `Page12BackCover` es la pág 12 (la contratapa es la pág 46). Son vestigios de refactorizaciones editoriales intermedias.
- **Causa raíz:** Archivos creados como alias o wrappers de conveniencia que no fueron depurados al consolidar la paginación final de 46 páginas en `EvoMagazineView.tsx`.

---

## 7. MATRIZ DE VERIFICACIÓN TÉCNICA

- **TypeScript (`npx tsc --noEmit`):** ✅ 0 errores.
- **Build de Producción (`npm run build`):** ✅ Exitoso (Vite genera todos los chunks y assets).
- **Suite de Regresión (`npm run evo:regression`):** ✅ 181/181 comprobaciones superadas.
- **Persistencia y Modos Operativos:** ✅ Intactos (LocalStorage seguro, RBAC, Firebase, modo pericial/estándar).
