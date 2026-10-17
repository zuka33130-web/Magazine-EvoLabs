# Tomo 03 · integración del tratado

Fecha: 2026-10-16 (Argentina). Rama canónica: `main`. Base de integración: `9fccc31c0a7643f376bb9c7b1cdc374f1f604d71`.

El usuario eligió reorganizar el índice principal según 00–12 y VI–VII. La revista y el banco usan el mismo índice de 15 temas. Cada tema desarrolla ENTENDER → OBSERVAR → MEDIR → DIAGNOSTICAR → COMPROBAR y enlaza los protocolos y recursos existentes. El banco complementario conserva sus 35 IDs, contenidos y expedientes, salvo las correcciones técnicas expresamente enumeradas abajo. No se renumeran registros de progreso.

## Correspondencia entre temas y módulos originales

| Tema | Contenido | Módulos del banco |
| --- | --- | --- |
| 00 | Taller seguro, ESD y recepción | 01 |
| 01 | Tornillos, conectores y desmontaje | 05, 14, 11, 13 |
| 02 | Temperatura y refrigeración | 12 |
| 03 | Fuentes y VRM | 04, 11, 14 |
| 04 | PCB multicapa y lectura de redes | 14 |
| 05 | CPU, RAM, socket y PCIe | 08, 11, 13 |
| 06 | SATA, NVMe, USB y preservación | 15, 17, 18, 21 |
| 07 | Multímetro, osciloscopio e interpretación | 04, 30 |
| 08 | Dependencias de encendido | 03, 05, 07 |
| 09 | BIOS/UEFI, SPI y recuperación | 10, 09 |
| 10 | Reemplazo de motherboard | 14, 11, 21, 31, 34 |
| 11 | Componentes y diagnóstico electrónico | 14, 04 |
| 12 | Validación y entrega | 31, 02, 12, 34 |
| VI | Microsoldadura y capacitores | 14 |
| VII | GPU, VRAM y límites del reballing | 13, 14 |

Los 15 temas son una organización pedagógica, no 15 laboratorios comerciales adicionales. Los módulos 15–35 conservan su profundidad anterior: no se anuncian como nuevas especializaciones profesionales completas. Se mantienen las 14 especializaciones existentes, los cuatro laboratorios guiados y las nueve herramientas del banco.

## Casos y persistencia

Dos casos nuevos reutilizan `EvoRepairLab` y el motor de evidencias existente:

- Laboratorio 8: capacitor C7 en placa de entrenamiento aislada. Identificación, medición aislada, equivalencia, planificación del retrabajo y validación simulada. Clave `professional['treatise-lab-08']`; contexto del módulo 14.
- Laboratorio 9: GPU sin imagen, con topología y documentación expresamente ficticias. Aislamiento de una etapa reguladora, diagnóstico y comprobación. Clave `professional['treatise-lab-09']`; contexto del módulo 13.

La resolución exige observaciones previas, hipótesis sustentada y reparación adecuada. Las maniobras inseguras se rechazan. Los valores didácticos no se presentan como mediciones reales ni como especificaciones eléctricas de una RTX 3070 comercial.

Se conserva `evo_tomo03_repair_workbench_v1`, esquema 1. No se renombran claves anteriores ni se copia el avance del caso especializado sobre el caso original del módulo propietario. La exportación TXT incluye las evidencias del nuevo caso correspondiente al módulo; no genera certificación automática.

## Correcciones localizadas

- Módulo 15: SMART favorable no certifica salud; se prioriza preservación y se distinguen formato, protocolo e interfaz. Se retiran porcentajes y diagnósticos mecánicos sin sustento.
- Módulo 30: se sustituyen superlativos de herramientas y tiempos universales de estrés por objetivo, condiciones y criterios específicos del hardware.
- Módulo 31: se elimina el criterio universal de 30 minutos/80 °C y la curva fija de ventilación. Se verifica el síntoma original sin introducir optimizaciones simultáneas.
- Módulo 34: se aclaran autorización y plan de preservación, sin trasladar automáticamente la responsabilidad de los datos al cliente.
- El desplegable de referencia mantiene su estado al limpiar la búsqueda.

## Archivos de esta integración

Producción:

- `src/data/tomo03Treatise.ts`: 15 temas, cinco etapas y destinos de recursos existentes.
- `src/data/tomo03TreatiseLabs.ts`: dos casos especializados.
- `src/components/tomo03/Tomo03TreatiseGuide.tsx`: índice compartido y lector contextual.
- `src/components/tomo03/Tomo03MagazineView.tsx`: índice principal y apertura del tema elegido.
- `src/components/tomo03/Tomo03WorkbenchView.tsx`: guía, referencia complementaria, navegación y expedientes de casos.
- `src/data/tomo03Data.ts`: cuatro correcciones técnicas anteriores.

Verificación y documentación:

- `scripts/evo-tomo03-professional.test.ts`.
- `scripts/evo-tomo03-professional-browser.mjs`.
- `scripts/evo-tomo03-workbench-fixture.tsx`.
- `scripts/evo-tomo03-treatise-browser.mjs`.
- Este informe.

## Verificaciones

Verificaciones del tratado original, repetidas durante la integración en main:

- TypeScript: sin errores.
- Build: correcto; persisten las advertencias existentes de tamaño de chunks e importaciones estáticas/dinámicas.
- Tests de contenido, evidencias, restauración y herramientas: 22/22.
- Regresión estructural: 84 PASS, 0 FAIL, 1 SKIP histórico de la ruta legacy del Tomo 01.
- Regresión del banco: 35 protocolos, cuatro prácticas, persistencia, intérprete ATX y expediente correctos; banco móvil sin desbordamiento.
- Regresión profesional: 14 módulos originales, árboles, evaluaciones, casos, herramientas, exportación y persistencia correctos.
- Navegación del tratado: correcta en la aplicación real; 15 temas y sus cinco etapas, todos los enlaces a módulos, herramientas y prácticas, ambos casos con evidencia ordenada, rechazo de maniobras inseguras y reparaciones erróneas, exportación, persistencia tras recarga, búsqueda, retorno y bloqueo FREE. Sin excepciones del navegador.

La prueba nueva parte de la aplicación real con identidad OWNER de prueba: Inicio → Biblioteca y tomos → vista previa del Tomo 03 → índice del tratado/banco. La identidad se sustituye exclusivamente al generar el bundle de pruebas, sin cambios en autenticación de producción. También se comprueba el bloqueo FREE. No se prueba una sesión real de Firebase ni se interviene hardware.

Comparación visual: la prueba utiliza los componentes originales de main en `9fccc31`, en lugar de la rama histórica. Se reprodujo en esa base el desbordamiento de la cabecera global OWNER a 390 px (`scrollWidth: 469`). El contenido del banco integrado cabe en su ancho; se verifica que los únicos elementos que exceden el ancho pertenecen a esa cabecera global sin modificar. No se afirma ausencia de desbordamiento en toda la aplicación.

Reproducción de la comparación y prueba nueva, tras el build:

```bash
EVO_TOMO03_BASELINE=1 EVO_TOMO03_OUTPUT=/tmp/evo-tomo03-treatise node scripts/evo-tomo03-treatise-browser.mjs
EVO_TOMO03_OUTPUT=/tmp/evo-tomo03-treatise node scripts/evo-tomo03-treatise-browser.mjs
```

Capturas y expedientes originales: `/workspace/scratch/tomo03-treatise/`. La nueva validación de main usa `/workspace/scratch/tomo03-main/` y `/workspace/scratch/tomo03-main-existing/`.

## Estado Git y límites

Origen: tratado local sobre `107d25dbe3e89abb86ff1284fdf30cad59876703`, con seis archivos rastreados modificados y cinco nuevos. Los 11 archivos se respaldaron en `/workspace/scratch/tomo03-transfer-main-20261016/original-11.tar.gz`, con manifiesto SHA-256 y parche. Se conserva también el stash de seguridad; no se descartó ningún cambio.

Por autorización expresa del usuario se cambió el mismo árbol de trabajo a la rama existente `main`, siguiendo `origin/main` en `9fccc31c0a7643f376bb9c7b1cdc374f1f604d71`. No se añadieron worktrees, ramas de tarea ni aplicaciones. Se trasladó la integración mediante combinación de cambios, sin reemplazar el lector más reciente por la versión histórica.

Se conservan dos cambios consolidados de main:

- `9fccc31`: eliminación del selector obsoleto T01–T04, identificación VOL. 03 / 12 y navegación por el menú global de los 12 tomos.
- `3ea6ff7`: normalización de saltos de línea CRLF/LF para las pruebas en Windows. El único conflicto de contenido estuvo en esta prueba y se resolvió manteniendo la normalización y las comprobaciones de los módulos no revisados.

La prueba Chromium toma main como referencia y abre VI y VII directamente desde el índice del lector real para utilizar sus laboratorios y exportar evidencias. El resto de los avances consolidados de main permanece intacto. Los cambios quedan locales, sin commit ni push, conforme a la instrucción expresa del usuario.

Durante las verificaciones, una ejecución de la regresión profesional perdió un CSS de `dist` porque el build aún estaba regenerándolo. Se repitió después de finalizar el build y pasó para los 14 módulos y todas las herramientas, sin cambios de código por ese incidente.

Revisión final: exactamente los 11 archivos indicados quedan preparados en el índice de Git sobre main. No hay archivos en conflicto, marcadores de combinación ni modificaciones fuera de esta integración. HEAD se mantiene en `9fccc31c0a7643f376bb9c7b1cdc374f1f604d71`; no se creó ningún commit ni se hizo push.

No se modifican otros tomos, portadas, registro comercial, Firebase, pagos, autenticación, telemetría ni otros árboles de trabajo.
