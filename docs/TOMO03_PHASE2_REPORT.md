# Tomo 03 · Fase 2 · módulos 01–14

Base conservada: `11bc22bdc0d31d5be08b642148b7cd3c8df0de53`. Única rama de desarrollo: `evo-tomo03-workbench`.

## Resultado implementado

Los 14 módulos utilizan el banco existente. Cada especialización incorpora tres niveles de explicación, diagrama funcional con relaciones, síntomas alternativos, procedimiento, instrumento/condiciones/referencia/incertidumbre/interpretación, técnica de taller con contraindicaciones, errores frecuentes, tres decisiones encadenadas, tres preguntas con devolución, caso investigable y referencias técnicas.

Se conservan 35 IDs, los contenidos completos de 15–35, las cuatro prácticas guiadas originales y el expediente. No se importó la rama EOE ni se modificaron otros tomos, portadas, autenticación o pagos. El trabajo pendiente de Tomo 02 permanece en su copia de trabajo anterior.

| Módulo | Especialización y caso operativo | Herramienta principal |
|---|---|---|
| 01 | Recepción, seguridad, ESD, autorización, preservación; riesgo que exige aislar y derivar | Checklist de banco |
| 02 | Diagnóstico diferencial, variable controlada, repetición; apagado bajo carga | Comparación de series |
| 03 | Trayecto externo, standby, PS_ON# y PWR_OK; cable externo defectuoso | Checklist de encendido |
| 04 | Regulación, carga, protecciones e incertidumbre; fuente implicada bajo carga | Intérprete ATX existente ampliado |
| 05 | Header por manual, contacto aislado; pulsador abierto | Identificador educativo de conectores |
| 06 | Pantalla/cable/salida/iGPU; ruta gráfica no disponible | Secuencia funcional POST |
| 07 | Indicadores documentados, entrenamiento y límites; módulo mal asentado | Secuencia funcional POST |
| 08 | Compatibilidad, perfil base y canal; patrón que sigue a un módulo | Matriz RAM 2 × 2 |
| 09 | RTC, batería, NVRAM, ajustes y cifrado; pérdida de hora sin red | Plan previo de firmware/recuperación |
| 10 | Modelo/revisión/versión y soporte; firmware sin soporte para CPU nueva | Decisión de firmware |
| 11 | Soporte, socket, EPS, regulación y límites; conexión EPS incompleta | Compatibilidad CPU/placa declarada |
| 12 | Transferencia, ambiente, carga y sensor; interfaz de cooler incorrecta | Perfil térmico por límite específico |
| 13 | Potencia, enlace, señal y software; alimentación auxiliar ausente | Conectores y árbol de descarte |
| 14 | PCB/VRM/montaje/intermitencia; contacto indebido con separador | Checklist e inspección documentada |

Conteos: **14 especializaciones, 42 preguntas, 42 nodos de diagnóstico y 14 escenarios con 42 pruebas discriminantes**. No son 42 laboratorios: cada conjunto de pruebas pertenece a su caso. Las cuatro prácticas anteriores siguen disponibles con su historia propia.

## Motor compartido y herramientas

`EvoRepairLab` usa un único motor. Seleccionar equipo/escenario no revela la resolución. Las pruebas tienen observaciones coherentes y prerrequisitos; acciones inseguras no generan evidencia; una hipótesis o reparación incorrecta no valida el caso. La resolución se muestra tras sustentar la intervención y comprobarla. Reiniciar un caso conserva evaluación y árbol.

Nueve accesos centrales: checklist, ATX con incertidumbre, conectores, antes/después, matriz RAM, POST, decisión de firmware, compatibilidad CPU/placa y perfil térmico. El ATX original conserva sus controles y se amplía en el mismo intérprete; no hay una calculadora duplicada. Los árboles de síntomas y el generador de expedientes se integran en cada recorrido.

- ATX: distingue valor central e intervalo; cruzar una tolerancia produce “indeterminado”. No mide rizado ni transitorios.
- RAM: no inventa celdas no probadas; distingue patrón de módulo, camino de canal y resultado inconcluso.
- POST: modelo didáctico de dependencias y detención, sin tabla universal de códigos ni detección física.
- CPU: requiere identidad, sockets y confirmaciones de soporte; una coincidencia mecánica no acredita compatibilidad.
- Térmica: usa límite aportado para el modelo, delta sobre ambiente y margen; no precarga un umbral universal de salud.
- Comparación: al menos tres muestras por serie, tamaños iguales, mediana/rango/delta; base cero no produce porcentaje inventado.

## Persistencia y expediente

El esquema original `evo_tomo03_repair_workbench_v1` conserva notas y las cuatro prácticas. Agrega estados profesionales por módulo. La carga normaliza campos inválidos; un `verified` aislado no valida un caso sin las observaciones, hipótesis e intervención correspondientes. Los borradores de herramientas y ATX se guardan aparte del progreso educativo.

El TXT incluye contexto, síntoma, observación, hipótesis, prueba, resultado, diagnóstico y grado de certeza, validación, recuperación, limitaciones, ruta de decisiones y registro de investigación simulada. La lectura ATX se identifica como ingreso no verificado. El banco permite completar una actividad didáctica sin sensores ni agente.

## Correcciones técnicas

Se eliminaron porcentajes de fallas sin fuente, tiempos y temperaturas universales, equivalencias falsas de códigos POST, una conclusión de placa/fuente perfectas por un arranque, una sugerencia general de reparación de pines con aguja, una tabla de Clear CMOS universal y atribuciones directas de artefactos a VRAM. Se corrigió la interpretación de incertidumbre y de pruebas sin carga. El kit distingue continuidad sin energía, instrumental apropiado y límites de limpieza, pasta, testers y protección ESD.

Los módulos 15–35 tienen carencias registradas en `TOMO03_PHASE2_AUDIT.md`; se mantienen intactos y no se anuncian como completados por esta fase.

## Validación reproducible

Archivos de implementación: `src/components/tomo03/Tomo03WorkbenchView.tsx`, `Tomo03ProfessionalModule.tsx`, `EvoRepairLab.tsx` y `Tomo03RepairTools.tsx`; en `src/data/`, `tomo03Data.ts`, `tomo03ProfessionalTypes.ts`, `tomo03ProfessionalContent.ts`, `tomo03RepairContentHelpers.ts`, `tomo03RepairEngine.ts` y `tomo03RepairBlockA/B/C.ts`.

Pruebas: `scripts/evo-tomo03-professional.test.ts`, `evo-tomo03-professional-browser.mjs`, `evo-tomo03-workbench-fixture.tsx` y `evo-tomo03-workbench-regression.mjs`. Documentación: este informe, `TOMO03_PHASE2_AUDIT.md` y `TOMO03_WORKBENCH_MASTER_PLAN.md`.

Desde la raíz del repositorio:

```sh
npm run lint
npm run build
npm run evo:regression
node scripts/evo-tomo03-workbench-regression.mjs
node --import tsx --test scripts/evo-tomo03-professional.test.ts
node scripts/evo-tomo03-professional-browser.mjs
```

- TypeScript y compilación Vite ejecutados correctamente. Vite conserva avisos de bundles grandes e importaciones estáticas/dinámicas ya presentes.
- Regresión estructural: 84 PASS, 0 FAIL y 1 SKIP previsto de compatibilidad antigua de Tomo 01.
- Regresión original del banco: PASS, 35 protocolos, cuatro prácticas, persistencia, ATX, expediente y móvil.
- Pruebas específicas: 19 PASS, 0 FAIL; contrato, conservación de 15–35, casos prematuros/incorrectos/válidos, restauración y límites numéricos.
- Chromium: recorridos de los 14 módulos, tres niveles, ramas, evaluación, investigación, reparación y exportación; las notas previas sobreviven a recarga. Escritorio 1440 × 1000 y móvil 390 × 844.
- Verificación final de los nueve accesos de herramientas: PASS en móvil sin desbordamiento; checklist, conectores, límites numéricos y resultados comprobados. Accesos directos desde cada módulo y navegación manual → banco → manual: PASS.

Las pruebas usan un navegador aislado con registros de prueba, nunca datos reales de un usuario. No acreditan reparación física, medición instrumental, ejecución en Windows ni revisión presencial por un técnico.

## Capturas y commits

Capturas reales generadas por Chromium en `/workspace/scratch/tomo03-block-c`: módulos 01, 05, 08, 10, 12 y 14 en escritorio/móvil; herramientas en ambos tamaños. Los expedientes de los 14 casos se exportan como TXT en esa carpeta. El script permite elegir la carpeta con `EVO_TOMO03_OUTPUT`.

- Bloque A: `8a18f0b`.
- Bloque B: `5b23b45`.
- Bloque C: commit que contiene este informe y la validación final.

La solicitud autoriza commits por bloque. No se realizó push ni merge.

## Limitaciones y siguiente fase

Sistema educativo con casos simulados y entradas declaradas; no sensores, flasheo ni manipulación de hardware. La documentación oficial del modelo exacto sigue siendo necesaria para pines, códigos, compatibilidad, límites y recuperación. Las referencias de soporte no equivalen a una base universal validada de todos los productos. La revisión práctica por técnico y el desarrollo especializado de 15–35 permanecen fuera de esta fase. No se declara Gold Master del tomo completo.

Próxima fase: módulos 15–24, con preservación de datos, SMART con límites, rescate sobre copia, particiones simuladas y recuperación/instalación segura.
