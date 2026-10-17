# Tomo 03 · auditoría y alcance de Fase 2

Base: `11bc22bdc0d31d5be08b642148b7cd3c8df0de53`. Rama existente: `evo-tomo03-workbench`.

Se revisaron los 35 registros de `tomo03Data.ts`, los ocho instrumentos del kit, los cuatro laboratorios de `tomo03WorkbenchData.ts`, la navegación del banco y su expediente local. La base pasó TypeScript, regresión estructural (84 PASS, 0 FAIL, 1 SKIP previsto) y `evo-tomo03-workbench-regression.mjs` en Chromium.

## Matriz previa a la especialización

| Módulo | Hallazgo y trabajo requerido |
|---|---|
| 01 | Pregunta de descarga ambigua; falta recepción, alcance, ESD y preservación con criterios de parada. |
| 02 | Método acertado pero resumido; falta diseño de prueba falsable, repetición e incertidumbre. |
| 03 | Buena advertencia inicial; falta separar camino externo, standby, petición y carga. |
| 04 | Colores como identificación, temporización universal y promesa de estabilidad; falta regulación/carga/incertidumbre. |
| 05 | Un arranque declara placa/fuente perfectas; maniobra con herramienta metálica presentada como segura. |
| 06 | Porcentaje de consultas sin fuente y señal de monitor interpretada como estado POST. |
| 07 | Orden POST “inquebrantable” y códigos universales: falta contexto de fabricante y limitaciones. |
| 08 | Slots y limpieza generalizados; falta matriz módulo/ranura, control JEDEC y entrenamiento. |
| 09 | Umbral de pila y tiempo Clear CMOS universales; falta riesgo de cifrado y ajustes previos. |
| 10 | Prohibición absoluta de método de actualización y Flashback universal; falta soporte exacto y recuperación. |
| 11 | Tiempo/temperatura/frecuencia universales y reparación de pines con aguja; falta compatibilidad y derivación. |
| 12 | Temperatura fija e inferencia de causa por sensor; falta comparación de perfiles y montaje específico. |
| 13 | Artefactos adjudicados directamente a VRAM/GPU; falta aislamiento de cable, pantalla, alimentación y software. |
| 14 | Inspección útil pero incompleta; apariencia de capacitor no excluye falla; falta intermitencia y límites de intervención. |
| 15 | SMART favorable usado como descarte absoluto; pendiente de fase siguiente, sin modificación aquí. |
| 16 | EPS desconectado usado para confirmar corto VRM; pendiente de especialización posterior. |
| 17 | Ficha y árbol simple; ampliar evidencia de arranque en otra fase. |
| 18 | Medio de rescate resumido; falta validación de imagen y arquitectura, fuera de 01–14. |
| 19 | Tamaños de particiones fijos; necesita matices y simulación de preservación posteriormente. |
| 20 | Reparación/reinstalación demasiado binaria; no es módulo completado. |
| 21 | Checklist parcial de backup; falta comprobación de restauración. |
| 22 | Dependencia de versión en OOBE y recomendaciones generales; pendiente de revisión posterior. |
| 23 | Árbol contradice la nota de orden de drivers; se registra, no se altera fuera del bloque solicitado. |
| 24 | Reinicios/horas activas presentados con garantías; revisión futura. |
| 25 | Saturación adjudicada a causas concretas sin discriminación; revisión futura. |
| 26 | Movimiento del cursor usado como diagnóstico de subsistema; revisión futura. |
| 27 | Apagado brusco adjudicado a fuente y límites VRM universales; revisión futura. |
| 28 | Módulo de dump usado como culpable directo; revisión futura. |
| 29 | Malware resumido; requiere triage y límites de confianza posteriores. |
| 30 | Duración fija de estrés y superlativos de herramientas; pendiente. |
| 31 | Temperatura/duración universales para entrega; no equivale a validación integral. |
| 32 | Casos didácticos identificados; falta biblioteca de evidencia y alternativas. |
| 33 | Máquina desconocida con un solo descarte; falta examen práctico ramificado. |
| 34 | Expediente TXT activo; faltan recepción y parte imprimible completos. |
| 35 | Glosario básico; falta buscador y referencias por modelo. |

Los módulos 15–35 conservan sus contenidos y estado de desarrollo; la Fase 2 no declara terminado el tomo completo.

## Reutilización y límites

- Se conserva el único banco `Tomo03WorkbenchView`, los 35 IDs, las cuatro prácticas guiadas y el expediente original.
- `EvoRepairLab` es un motor compartido con observaciones, prerrequisitos, hipótesis, intervención y validación, utilizado por los módulos especializados y por el banco central.
- La resolución del caso no se muestra antes de completar las pruebas discriminantes y seleccionar una intervención sustentada. El código cliente contiene el escenario didáctico; no es un sistema antitrampas ni una certificación externa.
- Los nuevos campos se agregan al almacén local existente, sin eliminar notas ni respuestas anteriores. Los instrumentos tienen su propio borrador local, separado del progreso educativo.
- Diagramas funcionales no sustituyen patillajes, códigos o procedimientos del fabricante. Las referencias enlazan documentos o centros oficiales; compatibilidad exacta requiere el modelo y revisión del equipo.
- Las pruebas no ejecutan comandos sobre una PC Windows ni aplican tensión a hardware: verifican lógica y escenarios simulados.
