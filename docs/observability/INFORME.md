# EVO Observability Engine 1.0 · Informe de entrega

## Estado

Implementación de Entrega 1 en rama aislada **evo-observability-engine-1**, base **ce093e5eee9dc9def78461933515f0f9c680a103**. Auditoría de las siete ramas documentada antes de editar código. El worktree original permanece en evo-tomo02-501-investigaciones sin cambios. No hubo merges ni push.

**La aceptación de captura Windows está pendiente.** Se completó todo lo verificable en este host Linux: contrato, motor, seguridad HTTP real, interfaz, navegación, exportación, compilaciones y regresiones. No se declara la entrega completamente aceptada sin una sesión nativa Windows. Los tests con fixture se identifican como tales; no representan mediciones del PC del usuario.

## Hallazgos y arquitectura

La base actual fue la más completa y conserva sectores y diseños recientes. Los agentes de las otras ramas no aportaban un emparejamiento más avanzado. Hallazgo previo alto corregido: /health y alias entregaban un token reutilizable. Ahora se exige código local de un uso, límites de intentos y tokens temporales ligados al Origin, sin tokens de sesión en health/logs/exports. Se mantiene 127.0.0.1:43921 y la allowlist original.

El motor reutiliza AgentTelemetryManager y EvoAgentClient: una captura simultánea, contrato versionado compartido, valores nullable, fuente/UTC/calidad, series acotadas, estadísticas y exportación local. Live Telemetry PRO se monta por demanda en ANALIZAR MI PC con vistas rápida/técnica/experta, SVG inspeccionable, perfil juegos y controles de sesión. No hay nuevos motores de laboratorio ni progreso duplicado. Tutor recibe observaciones y límites, no diagnósticos inventados. Documentación técnica: [auditoría](AUDITORIA.md), [arquitectura](ARQUITECTURA.md), [agente](../../evo-agent/README.md).

## Funciones implementadas

- Captura unificada CPU global/lógica, memoria física/disponible/ocupación, compromiso, disco/red/procesos y autocosto mediante proveedores reales Node/Windows; validación nativa de CIM pendiente.
- Primera CPU sin delta y contadores ausentes = UNKNOWN con causa, sin cero fabricado. Latencias con fórmula raw reproducible, evidencia exportada y recálculo de integridad en el navegador.
- Registro volátil, mínimo/máximo/media/P50/P95, pausa/reanudación/finalización, cancelación compartida, reconexión, rechazo de fuentes/unidades/timestamps/orden inválidos y duplicados.
- Máximo 300 frames, 8 MiB de JSON compacto y ventana de 15 minutos al ingresar registros. Captura 1–10 s, refresco visual 0.5–5 s, perfil juegos 5/2 s y descanso tras consultas lentas.
- Pausa al ocultar/abandonar la vista; sin persistencia ni transmisión externa automática. Exportación JSON/CSV guarda el contrato, respeta telemetry_download y evita fórmulas de planilla; FREE conserva el paywall existente.

## Verificaciones ejecutadas

| Verificación | Resultado |
|---|---|
| Baseline npm run lint / npm run build | Ambos correctos antes de cambios |
| npm run lint | Correcto, cero errores |
| tsc -p evo-agent/tsconfig.json | Correcto, modo strict |
| npm run build | Correcto; advertencia preexistente de chunks >500 kB |
| npm run evo:observability | 12 pruebas PASS, 0 FAIL; incluyen contrato, autenticación HTTP real, expiración/origen/Host/PNA, latencia/evidencia, unidades, null/NaN, percentiles, retención/bytes, CSV/JSON, cancelación de lectores, reconexión, secuencias y warmup |
| npm run evo:observability:browser | PASS en Chromium real 1440/390; WorldMap original + autenticación y HTTP TEST: conexión, tres niveles, perfil, pausa, UNKNOWN, reconexión, selección CPU lógica tras desconexión, exportación/permisos, Tutor y retorno |
| npm run evo:regression | 84 PASS / 0 FAIL / 1 SKIP, igual que baseline; omisión legacy Tomo 01 documentada por la suite |
| node scripts/evo-labs-catalog-regression.mjs | PASS; 88 IDs únicos (80 laboratorios + ocho zonas); propiedad, filtros, destinos y estados conservados |
| node scripts/evo-labs-browser-regression.cjs | PASS; catálogo, Tomos 01/02, todos sus accesos comprobados por la suite, gaming directo, regreso y restricciones FREE |
| node --import tsx scripts/evo-tomo02-sectors-regression.tsx | PASS; 29 lectores recuperados, 501 investigaciones, 531 fuentes complementarias, evidencia y puertas de progreso; 72 archivos originales intactos |
| node scripts/evo-tomo02-original-sectors-regression.mjs | PASS; sectores 00–10 y 11–39, misiones/tests/diagramas/casos y navegación |
| Vite preview 127.0.0.1:3000 | HTTP 200; preview temporal cerrado al terminar |
| git diff --check / comparación de archivos protegidos contra la base | Correctos; sin cambios en portadas, registro/propiedad, sectores, investigaciones, Firebase o control de acceso |

Los tests reales HTTP ejecutan el agente Node en Linux y comprueban su rechazo explícito de plataforma: **no acreditan captura Windows**. La navegación usa el componente real, con identidades y respuestas de contrato TEST; sin llamadas a pagos/Firebase. Las capturas con valores llevan un rótulo explícito de datos sintéticos.

Incidencias resueltas durante validación: la suite visual antigua elegía el primer CSS de dist; el nuevo chunk lazy hacía seleccionar el CSS de observabilidad. Dos selectores de tests ahora eligen index-*.css, sin tocar el diseño de los tomos. El test de Host usa HTTP nativo, porque fetch del runtime ignoraba el Host propuesto. El sandbox impedía sockets/subprocesos en modo restringido; se ejecutaron las pruebas con los permisos locales necesarios. Ningún fallo final se oculta.

## Mediciones acotadas (no son un benchmark Windows)

Entorno Linux x64, Node v24.19.0, 3 procesadores lógicos. Último harness sin compilaciones concurrentes: 1.000 normalizaciones/insertados de contrato TEST, 63.178 ms de pared y 82.549 ms CPU del proceso de prueba; 300 frames retenidos y 700 retirados; 1965001 bytes de JSON retenido. RSS del proceso de pruebas 85.18 → 95.81 MiB. Es RSS del harness con runtime/tests, no memoria atribuible exclusivamente al motor ni al agente Windows; GC/JIT afectan el resultado.

Chromium 1440×1100, captura TEST 1 s / UI 0.5 s, intervalo observado 2.977 s: TaskDuration del hilo principal 0.112102 s (3.77% del intervalo); JS heap 14.99 → 15.40 MiB. TaskDuration no equivale a CPU del sistema y JS heap no es RSS total del navegador. Este ensayo corto solo comprueba costo del recorrido de contrato; falta carga Windows representativa y perfil juegos real.

Los paneles de costo muestran lecturas del agente/PowerShell cuando existen; no convierten esas pruebas en un resultado real del usuario. La interfaz informa tiempo de normalización/inserción, sin presentarlo como CPU total de React.

## Capturas y evidencia local

- [Escritorio, sin lecturas reales](/workspace/scratch/eoe-delivery1/browser/sin-agente-1440.png)
- [Móvil, sin lecturas reales](/workspace/scratch/eoe-delivery1/browser/sin-agente-390.png)
- [Escritorio, contrato TEST rotulado](/workspace/scratch/eoe-delivery1/browser/contrato-test-1440.png)
- [Móvil, contrato TEST rotulado](/workspace/scratch/eoe-delivery1/browser/contrato-test-390.png)

Directorio reproducible: establecer EOE_BROWSER_OUTPUT al ejecutar la prueba de navegador. Las capturas/artefactos del harness quedan fuera de los assets de la aplicación y de Git. Los registros de esta ejecución están en /tmp/eoe-*.log; benchmark del motor /tmp/eoe-engine-benchmark.json y del navegador en el directorio anterior. No contienen credenciales reales.

## Límites y próxima entrega

1. Este host no es Windows y no dispone de PowerShell/CIM nativo ni del agente del PC del usuario. Falta comprobar valores contra Windows, proveedores ausentes por edición/permisos, latencia raw y contador de compromiso, procesos e interfaces físicas/virtuales.
2. Falta medir CPU/RAM del agente, PowerShell y navegador durante sesiones Windows representativas, incluyendo perfil juegos. Los ensayos anteriores no permiten afirmar un presupuesto real en ese escenario.
3. Hace falta actualizar agente y cliente juntos: el handshake inseguro anterior se elimina deliberadamente. Orígenes de producción distintos de los dos actuales continuarán rechazados; una nueva URL requiere autorización explícita. El navegador puede exigir permiso de acceso a red local.
4. Sesiones efímeras: exportación opt-in; no hay persistencia, agregación histórica, Time Machine, alertas, eventos, anomalías ni diagnóstico automático. No se ejecutaron pruebas de módulos que todavía no existen.
5. Primero cerrar aceptación nativa Windows; luego Entrega 2: persistencia local opt-in, agregación acotada y comparación experimental sobre el mismo motor y contrato.

## Archivos modificados

- `docs/observability/ARQUITECTURA.md`
- `docs/observability/AUDITORIA.md`
- `docs/observability/INFORME.md`
- `evo-agent/README.md`
- `evo-agent/package.json`
- `evo-agent/src/capabilities.ts`
- `evo-agent/src/index.ts`
- `evo-agent/src/observabilityProtocol.ts`
- `evo-agent/src/security.ts`
- `evo-agent/src/telemetry.ts`
- `evo-agent/src/types.ts`
- `evo-agent/src/windowsTelemetry.ts`
- `package.json`
- `scripts/evo-labs-browser-regression.cjs`
- `scripts/evo-observability-browser.mjs`
- `scripts/evo-observability.test.ts`
- `scripts/evo-tomo02-original-sectors-regression.mjs`
- `src/components/evoLabCore/services/evoAgentClient.ts`
- `src/components/observability/EvoObservabilityCenter.tsx`
- `src/components/observability/observability.css`
- `src/components/world/EvoWorldMap.tsx`
- `src/components/world/labs/windowsMatrix/EvoWindowsXRayLab.tsx`
- `src/observability/engine.ts`
- `src/observability/localEngine.ts`
- `src/observability/series.ts`
