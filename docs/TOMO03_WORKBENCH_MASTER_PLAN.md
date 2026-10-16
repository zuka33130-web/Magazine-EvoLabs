# EVO LABS // TOMO 03 — SISTEMA PROFESIONAL DE REPARACIÓN
**Estado:** desarrollo incremental; no Gold Master. **Base preservada:** Tomo 02 en `3a9b9e2`. **Rama:** `evo-tomo03-workbench`.

## Producto, no solo curso
La edición A4 es una vista editorial. La capa operativa "Banco interactivo" es una herramienta de diagnóstico, práctica y registro. Evitar confundir ambas interfaces o repetir la misma ficha 35 veces.

**Contrato editorial por módulo** (se implementa y audita, no se da por completado hoy):
1. **Entendé:** qué falla, cómo funciona el sistema, síntomas similares con causas diferentes; explicación corta + profundidad escalonada.
2. **Identificá:** diagrama funcional y conexiones, referencias de fabricante o estándar cuando corresponda.
3. **Medí:** procedimiento acotado, instrumento/escala, límites y posibilidad de error, antes de cualquier sustitución.
4. **Descartá:** árbol de al menos tres decisiones, con qué hallazgo falsaría cada hipótesis y cuándo detenerse.
5. **Intervení:** reparación adecuada al síntoma, advertencias, precauciones ESD, autorización y reversión.
6. **Comprobá:** línea base, réplica de falla, resultado posterior, estabilidad y limitaciones.
7. **Practicá:** escenario con decisiones, retroalimentación específica, errores comunes y prueba repetible.
8. **Documentá:** expediente exportable que separa **simulado / ingresado por usuario / telemetría verificada**. Nunca inventar sensores, certificaciones ni porcentajes de éxito.
9. **Atajo útil:** truco profesional comprobable, condiciones en las que ayuda, contraindicaciones y cómo verificarlo.
10. **Referencias:** documentación oficial, manual del fabricante y fecha/versión cuando un valor depende de modelo o firmware.

## Mapa de cobertura obligatoria: 35 módulos
| Módulo | Núcleo técnico y diagnóstico profundo | Laboratorio práctico y herramienta asociada |
|---|---|---|
| 01 Seguridad de banco | Tres niveles, ESD, recepción, autorización y preservación | Caso de riesgo con parada/derivación, checklist, árbol y evaluación activos |
| 02 Método de descarte | Hipótesis rivales, control, repetición e incertidumbre | Caso de apagado con prueba aislada; comparador de series activo |
| 03 Sin energía | Trayecto externo, standby, PS_ON/PWR_OK y carga | Caso de cable externo, árbol encadenado y checklist activos; LAB 01 conservado |
| 04 ATX | Rieles, protecciones, carga, transitorios y límites de instrumento | Intérprete original ampliado con incertidumbre; caso bajo carga y conectores activos |
| 05 Power/panel | Header por manual, contacto aislado, retención e intermitencia | Caso de pulsador, identificador educativo y árbol activos; sin pinout universal ficticio |
| 06 Sin video | Ruta de pantalla, salida soportada, iGPU y POST | Caso de ruta incorrecta y mapa funcional activos; LAB 02 conservado |
| 07 POST | Secuencia y alcance de indicadores según documentación | Simulador funcional activo; los códigos reales se consultan en manual exacto, no en tabla universal |
| 08 RAM | Perfil base, entrenamiento, topología, módulo/slot/canal | Matriz RAM y caso de módulo defectuoso activos |
| 09 CMOS/NVRAM | RTC, pila, retención, configuración y cifrado | Caso de retención, expediente y decisión previa a reset activos |
| 10 Firmware | Identidad, soporte, versión, imagen y recuperación | Decisión de firmware y caso de soporte CPU activos; nunca flasheo real |
| 11 CPU | Soporte, socket, EPS, VRM y límites de descarte | Compatibilidad declarada, árbol y caso EPS activos |
| 12 Refrigeración | Interfaz, flujo, ambiente, potencia y sensor | Evaluador térmico por límite del modelo, comparador y caso de montaje activos |
| 13 GPU | Alimentación, enlace, salida, controlador y artefactos | Árbol y caso de alimentación auxiliar activos; identificador de conectores compartido |
| 14 Motherboard | PCB, VRM, fijaciones, intermitencia y derivación | Caso de contacto con separador, guía de inspección y árbol activos |
| 15 SSD/HDD/NVMe | SMART, integridad, copia, falla física vs lógica, interfaces | **LAB 04 activo**; lector guiado de SMART pendiente |
| 16 Apagado a segundos | protección, ventilador, corto, montaje, configuración mínima | LAB 03 activo; simulador de eventos pendiente |
| 17 Sin inicio de SO | UEFI/BCD, volumen, cifrado, fallo físico vs corrupción lógica | LAB 04 activo; diagnóstico de arranque pendiente |
| 18 USB rescate | medio oficial, imágenes, arquitectura, comprobación hash | LAB 04 activo; constructor guiado de pendrive pendiente |
| 19 Particiones | GPT/MBR, ESP/MSR, volúmenes, riesgos de borrado | LAB 04 activo; mapa interactivo sin operaciones reales pendiente |
| 20 Formateo | restablecer vs reinstalar vs borrar disco, decisión de retención | LAB 04 activo; simulador de decisiones destructivas pendiente |
| 21 Backup | consentimiento, ubicaciones, cifrado, copias verificadas | LAB 04 activo; manifiesto de respaldo pendiente |
| 22 Instalar Windows | detección de destino, versiones, drivers, comprobación, recuperación | LAB 04 activo; asistente de instalación segura pendiente |
| 23 Drivers | ID hardware, versiones, rollback, fuentes oficiales y dependencias | simulador de conflicto de drivers pendiente |
| 24 Windows Update | LCU, firmware y actualizaciones opcionales, reversión | laboratorio de control de cambios pendiente |
| 25 PC lenta | CPU/RAM/disco/temperatura, carga reproducible, baseline | LAB 03 activo; triaje de rendimiento pendiente |
| 26 Congelamientos | memoria, almacenamiento, controladores, eventos, estrés acotado | LAB 03 activo; correlacionador de eventos pendiente |
| 27 Reinicios | WHEA, fuente, temperatura, errores y evento 41 no causal | LAB 03 activo; línea de tiempo de incidentes pendiente |
| 28 BSOD | stop code, dumps, símbolos, evidencia vs sospecha | LAB 04 activo; decodificador de registros pendiente |
| 29 Malware | triage, aislamiento, evidencia y reinstalación cuando corresponde | laboratorio de respuesta segura pendiente |
| 30 Toolkit | qué mide cada herramienta, limitaciones, alternativas gratuitas | selector profesional de herramientas pendiente |
| 31 Validación final | estabilidad, rendimiento, integridad, entrega y garantía | LAB 03 activo; checklist verificable pendiente |
| 32 Casos de taller | casos explícitamente simulados o reales con procedencia, múltiples causas | biblioteca de expedientes y errores frecuentes pendiente |
| 33 Banco final | caso desconocido con evidencias parciales, decisión y justificación | examen práctico ramificado pendiente |
| 34 Parte de servicio | recepción, autorización, inventario, informe, aceptación | **expediente TXT inicial activo**; formulario imprimible interactivo pendiente |
| 35 Glosario y referencias | conceptos por disciplinas, versiones de estándares y enlaces auditados | buscador de referencias contextual pendiente |

## Alcance implementado y verificado en Fase 2
- Navegación desde el Tomo 03 al banco, manteniendo el manual A4.
- Protocolos y registro manual de evidencia para los 35 módulos; rama sí/no/no probado.
- Cuatro simulaciones con decisiones contextualizadas y retroalimentación.
- Intérprete numérico de rieles ATX; sin lectura de voltajes real.
- Expediente por módulo persistido en almacenamiento local y exportación TXT; no certificado.
- Correcciones de seguridad (fuente ATX, borrado de discos, orden de controladores) y de conteo del manual.
- Especialización de módulos 01–14: tres niveles, mapa, procedimiento, interpretación de mediciones, atajo con contraindicaciones, tres decisiones, tres preguntas y caso con evidencia.
- EVO Repair Lab comparte un motor con 14 escenarios; las cuatro prácticas anteriores conservan IDs, respuestas y recorrido.
- Nueve accesos de herramientas centrales: checklist, intérprete ATX con incertidumbre, conectores, comparación, RAM, POST, firmware, CPU y térmica. Árboles y expediente están integrados en el recorrido.
- Chromium ejecutado en escritorio y móvil; resultados y límites en `TOMO03_PHASE2_REPORT.md`.

## Definición de terminado por módulo
Una ficha A4 de una página **no** satisface este contrato. Una función etiquetada «pendiente» **no** se anunciará disponible. Un botón sin resultado observable es FAIL. Para dar por completado un módulo deben existir: teoría especializada, diagrama o mapa verificable, práctica con respuestas, herramienta o medición interpretada, advertencias, procedimiento de reversión, expediente y prueba funcional. Mantener acceso adaptable para quien comienza y para el técnico experimentado.

## Prioridad técnica
**Fase A**: motor de expediente y seguridad, cuatro fallas frecuentes, regresión Chromium (implementado, esperando ejecución).
**Fase B**: especialización de 01–14 implementada y comprobada por software; simulaciones y datos manuales, sin reparación física certificada.
**Fase C**: 15–24 (almacenamiento, rescate, firmware y sistema), protección de datos por defecto.
**Fase D**: 25–35 (inestabilidad, telemetría, herramientas, parte de servicio y examen final).
**Fase E**: evaluación de contenidos por técnico, contraste con documentación de fabricantes, pruebas E2E escritorio/móvil y publicación. El cierre del tomo debe comprobar todas las rutas, no solo un contador de módulos.
