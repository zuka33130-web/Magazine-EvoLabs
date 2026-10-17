# EVO Observability Engine · Auditoría previa a implementación

Fecha: 2026-10-15. Estado inicial limpio; base elegida `ce093e5eee9dc9def78461933515f0f9c680a103`, rama evo-tomo02-501-investigaciones. Inspección de referencias remotas después de fetch sin merges. Este documento se produjo fuera del repositorio antes de modificar código.

## Siete ramas

| Rama | SHA auditado | Archivos versionados | Ancestro de la base |
|---|---|---:|---|
| origin/evo-antigravity-20261013 | `f0f8de74050c95bed823683b6f276da934f32e35` | 585 | Sí |
| origin/evo-fase-15b-tomo02-labs | `65ce1251007a9bf0a358f3403531d61de8415af3` | 361 | No |
| origin/evo-fase-3a-practicar | `a2578cb96ee1f273a98ca0c183c9115c107b4716` | 586 | Sí |
| origin/evo-recovery-pro | `b4df211fcb13af0a730378c9eb570c0920a3a812` | 362 | No |
| origin/evo-tomo02-501-investigaciones | `ce093e5eee9dc9def78461933515f0f9c680a103` | 787 | Sí |
| origin/evo-tomo02-sectores-11-39 | `744698c8d8d58f2f98ec79d68cf6e9905430e94a` | 595 | Sí |
| origin/main | `6ff1713b32be1d41dab59ac759d2d88fceba39bd` | 360 | No |

La base conserva los últimos diseños de Tomos 01/02, los sectores recuperados y la organización comercial de laboratorios. Las ramas divergentes main/recovery/fase15 contienen estados anteriores (360–362 archivos); sus agentes y EvoAgentClient son iguales a la base. No se mezclan ramas automáticamente. Las diferencias relevantes son windowsDetectionService y los motores educativos/evidencia añadidos en la base. El número de archivos por sí solo no determina la selección: se contrastaron también ancestros, commits y diferencias del agente/servicios.

## Arquitectura y reutilización

Se leyeron AGENTS.md, EVO_RECOVERY_SOURCE_OF_TRUTH.md, EVO_UNIVERSE_OPERATING_SYSTEM.md y EVO_METHOD.md. Las referencias documentales a recovery-pro y diez tomos están desactualizadas respecto del catálogo de doce tomos actual; no se usa esa documentación para degradar la base.

- EvoWorldMap: seis áreas, ANALIZAR MI PC contiene detección/pasaporte, expedientes, PCB, sectores y consola. Integración mediante acceso contextual, sin séptima área ni cambios de rutas comerciales.
- EvoAgentClient: transporte único a 127.0.0.1:43921. Reutilizar para autenticación, inventario, telemetría y consumidores Windows X-Ray/Services. MachineAdapter sigue siendo el ingreso canónico del hardware.
- AgentTelemetryManager: CPU agregada por diferencias de os.cpus, memoria física y RSS/heap del agente. Ampliar ese colector, no abrir otro servicio ni puerto.
- hardwareSensorService: capacidades del navegador, rAF/audio y pistas; no equivale a contadores Windows del equipo. No convertirlo en una fuente ficticia de telemetría del sistema.
- telemetryIntegrityService: live-scan del servidor, dominio distinto del agente local. No inferir que el hardware del servidor es el PC del usuario.
- EvoTelemetryHUD: animación con aleatoriedad rotulada SIMULATED; conservar en simulaciones, nunca reutilizar como lectura EOE.
- baselineEngine, bottleneckEngine y digitalTwin/dynamicBottleneckEngine: modelos existentes para cargas, simulación y comparación. No reemplazar por nuevos diagnósticos ni presentar sus estimaciones como medidas.
- evoEvidenceEngine/evoForensicEngine/evoTechnicalCaseEngine/evoMethodEngine y caseRepository: trazabilidad educativa, expedientes y persistencia actual. Se preservan; adaptadores posteriores recibirán evidencia validada EOE. No escribir progreso ni duplicar expedientes en Entrega 1.
- Tutor EVO: contexto educativo reutilizable; la explicación completa y diagnósticos pertenecen a Entrega 6. Esta entrega debe mostrar fuentes y límites sin inferencias de IA.
- Experimentos y dossiers de capítulos y Windows Matrix permanecen independientes del monitor de solo lectura. No invocar experimentos de servicios desde EOE.

## Seguridad del agente (estado previo)

HOST estricto 127.0.0.1:43921. Origin permite localhost/127.0.0.1 y dos dominios exactos run.app; no wildcard. Endpoints públicos /health, /health/handshake, /v1/handshake, /v1/capabilities. Protegidos: machine, telemetry, start/stop y servicios/experimentos allowlisted. Arbitrary exec/shell/cmd/run/eval bloqueados. Lectura JSON limitada a 64 KiB.

**Hallazgo alto:** health y sus alias entregan sessionToken reutilizable sin emparejar. El cliente lo adopta automáticamente; se registra además un prefijo del token en consola. No existe emparejamiento por código en el agente actual de las ramas comparadas. Se debe implementar, no afirmar que ya estaba preservado.

Token actual no expira ni está ligado al Origin. Se requiere código local de uso único/expiración/intentos acotados, tokens temporales ligados al Origin, salud sin credenciales y errores de emparejamiento visibles. Mantener los orígenes actuales, puerto y rutas existentes; no aceptar comandos provenientes de HTTP. Cambiar esta seguridad está explícitamente autorizado por el pedido EOE, sin tocar autenticación Firebase/pagos.

## Integridad y rendimiento (estado previo)

Primera CPU inventa 0 por falta de delta; constructor descarta snapshot inicial. El timer de fondo y GET calculan CPU por separado, con ventanas inconsistentes. No hay timestamp/fuente/calidad por métrica, cancelación de GET, expiración ni sesiones, per-core, compromiso, discos, red, procesos o latencias verificadas. Algunos clientes silencian errores devolviendo null. Corregir estas limitaciones en el colector/cliente compartido y mostrar UNKNOWN con razón.

El host de ejecución es Linux, no un Windows del usuario. No hay acceso a un agente Windows personal. Las pruebas de contrato y seguridad HTTP local no acreditan captura Windows real. Latencia de disco no debe inferirse de throughput ni de contadores ya formateados sin fórmula verificada.

## Licencias y dependencias

Agente existente ISC; package raíz privado sin licencia declarada. Referencia Netdata LICENSE master: GPL v3, consultada junto con README; se toman principios generales, sin copiar código/UI ni añadir dependencias Netdata. EOE original sobre Node/React/TypeScript existentes, sin instalar servicios permanentes. Recharts ya existe pero un SVG ligero basta para la serie seleccionada. Sin envío externo ni nuevos SDKs.

## Plan preciso: Entrega 1

1. Worktree y rama aislados desde el SHA elegido; copiar este registro antes de editar código.
2. Contrato compartido versionado en evo-agent/src/observabilityProtocol.ts (tipos + catálogo de métricas puro, importable por navegador); extender telemetría sin eliminar campos legacy.
3. Emparejamiento seguro en security/index y EvoAgentClient; read-only Windows collector con comandos constantes, timeout y sin parámetros de shell controlados por HTTP.
4. Motor src/observability: validación/series acotadas/estadísticas/exportación/transporte único; sesión efímera, cancelación, perfil ligero y pausa al ocultar. Sin persistencia ni Time Machine todavía.
5. Centro original src/components/observability dentro de ANALIZAR MI PC. Tres niveles, sin rellenar datos, valores UTC/unidades/calidad, intervalos seguros, controles y exportación local.
6. Tests de contrato, seguridad HTTP, memoria acotada/estadísticas/cancelación/errores/export, navegación responsive y suites existentes. Documentar fallos iniciales por separado.
7. Informe con consumo de harness y límites Windows; commit local de desarrollo sin merge ni publicación en main.

No implementar alertas, correlación, detección de anomalías ni diagnósticos automáticos en esta entrega. Entrega 2: persistencia opt-in y comparación experimental sobre el mismo contrato, no un segundo colector.

## Inventario de archivos relacionados detectados

- `START-EVO-AGENT.cmd`
- `diagnostic-test.ts`
- `evo-agent/README.md`
- `evo-agent/START-EVO-AGENT.cmd`
- `evo-agent/package.json`
- `evo-agent/src/capabilities.ts`
- `evo-agent/src/index.ts`
- `evo-agent/src/inventory.ts`
- `evo-agent/src/security.ts`
- `evo-agent/src/telemetry.ts`
- `evo-agent/src/types.ts`
- `evo-agent/src/windowsServices.ts`
- `evo-agent/tsconfig.json`
- `src/authoring/templates/EvoEvidenceResultTemplate.tsx`
- `src/authoring/templates/EvoTechnicalCaseTemplate.tsx`
- `src/components/chapter04/Station04ControlledExperiment.tsx`
- `src/components/chapter05/Station01Baseline.tsx`
- `src/components/chapter05/Station03ProcessForensics.tsx`
- `src/components/chapter06/DiagnosticExpedienteModal.tsx`
- `src/components/chapter06/DiagnosticTestStation.tsx`
- `src/components/chapter06/InheritedEvidenceModal.tsx`
- `src/components/chapter06/diagnosticKnowledge.ts`
- `src/components/chapter07/InheritedEvidenceTracker.tsx`
- `src/components/chapter07/Tome01DossierView.tsx`
- `src/components/chapter07/abExperimentKnowledge.ts`
- `src/components/common/EvoCaseResolverModal.tsx`
- `src/components/common/EvoDigitalTwinViewerModal.tsx`
- `src/components/common/EvoForensicReportModal.tsx`
- `src/components/common/EvoMethodBadge.tsx`
- `src/components/common/EvoMethodGuideModal.tsx`
- `src/components/common/EvoTechnicalDossierModal.tsx`
- `src/components/common/EvoTomoDossierModal.tsx`
- `src/components/evoLabCore/components/EvoTechnicalEvidenceModal.tsx`
- `src/components/evoLabCore/components/EvoTelemetryIntegrityModal.tsx`
- `src/components/evoLabCore/services/baselineEngine.ts`
- `src/components/evoLabCore/services/bottleneckEngine.ts`
- `src/components/evoLabCore/services/digitalTwin/dynamicBottleneckEngine.ts`
- `src/components/evoLabCore/services/digitalTwin/evoDigitalTwinEngine.ts`
- `src/components/evoLabCore/services/digitalTwin/evoSystemLoadSolver.ts`
- `src/components/evoLabCore/services/digitalTwin/gameWorkloadRegistry.ts`
- `src/components/evoLabCore/services/digitalTwin/psuStressModel.ts`
- `src/components/evoLabCore/services/digitalTwin/thermalSimulationEngine.ts`
- `src/components/evoLabCore/services/digitalTwin/types.ts`
- `src/components/evoLabCore/services/evoAgentClient.ts`
- `src/components/evoLabCore/services/hardwareSensorService.ts`
- `src/components/evoLabCore/services/telemetryIntegrityService.ts`
- `src/components/evoLabCore/services/windowsDetectionService.ts`
- `src/components/evoLabCore/views/EvoLabCoreBottleneckView.tsx`
- `src/components/labs/tomo05/EvoNetworkForensicsLab.tsx`
- `src/components/labs/tomo07/EvoPerformanceMetrologyLab.tsx`
- `src/components/magazine/DossierP01Checkpoint.tsx`
- `src/components/magazine/DossierP02PuertasArranque.tsx`
- `src/components/magazine/DossierP03AppsInicio.tsx`
- `src/components/magazine/DossierP04Operacion100Programas.tsx`
- `src/components/magazine/DossierP05SegundoPlano.tsx`
- `src/components/magazine/DossierP06ServiciosWindows.tsx`
- `src/components/magazine/DossierP07SysMainExperimento.tsx`
- `src/components/magazine/DossierP08TareasProgramadas.tsx`
- `src/components/magazine/DossierP09TemporalesLimpieza.tsx`
- `src/components/magazine/DossierP10LimpiezaProfunda.tsx`
- `src/components/magazine/DossierP11MicroTweaks.tsx`
- `src/components/magazine/DossierP12FinalCheckpoint.tsx`
- `src/components/tomo02/advanced/Tomo02FinalExperiment.tsx`
- `src/components/tools/EvoBottleneckSimulatorView.tsx`
- `src/components/tutor/TutorEvoContext.tsx`
- `src/components/tutor/TutorEvoDrawer.tsx`
- `src/components/tutor/TutorEvoFloatingButton.tsx`
- `src/components/world/labs/EvoMasterLabPrintDossier.tsx`
- `src/components/world/labs/EvoTelemetryHUD.tsx`
- `src/components/world/labs/Lab04CamaraExperimentos.tsx`
- `src/components/world/labs/windowsMatrix/services/WindowsServicesTelemetryLab.tsx`
- `src/services/evoEvidenceEngine.ts`
- `src/services/evoForensicEngine.ts`
- `src/services/evoInteractiveDigitalTwin.ts`
- `src/services/evoMethodEngine.ts`
- `src/services/evoTechnicalCaseEngine.ts`

## Aclaraciones verificadas durante la integración

La ruta `/api/telemetry/live-scan` está implementada en el plugin de Vite, con consulta PowerShell constante del host del servidor; no es una fuente del agente personal. `server.ts` inicia con una escritura de prueba Firestore preexistente; no se ejecutó ese servidor durante esta tarea para evitar efectos ajenos. El preview utiliza Vite directamente. La política comercial existente tiene el recurso `telemetry_download`, por lo que se reutiliza su guard para JSON y CSV. No se modificó EvoAccessContext.

Baseline ejecutado antes de cambios: TypeScript sin errores, build correcto (18.50 s, advertencia existente de chunks >500 kB), regresión estructural 84 PASS / 0 FAIL / 1 SKIP. El SKIP es la ruta legacy del Tomo 01 que la propia suite marca como reemplazada. La referencia Netdata se utiliza solo a nivel conceptual; no hay código Netdata incorporado.
