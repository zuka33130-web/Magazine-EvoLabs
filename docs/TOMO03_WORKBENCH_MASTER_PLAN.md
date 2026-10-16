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
| 01 Seguridad de banco | ESD, energía almacenada, orden, autorización, preservación de datos | Simulador de recepción y evaluación de riesgo; checklist de seguridad |
| 02 Método de descarte | Hipótesis, probabilidad contextual, prueba controlada, sesgos | Detective EVO: seleccionar la siguiente comprobación y descartar hipótesis |
| 03 Sin energía | Trayecto externo, standby, PS_ON/PWR_OK conceptuales, prueba cruzada | **LAB 01 activo**: no enciende; lista de verificación |
| 04 ATX | Rieles y tolerancias, protecciones, carga, transitorios y conectores | LAB 01/03 activos; **intérprete ATX activo**, sin conexión al hardware |
| 05 Power/panel | Headers según placa, interruptores, continuidad sin tensión | LAB 01 activo; simulador de pines **pendiente** |
| 06 Sin video | Display/cable/puerto, CPU con/sin iGPU, GPU, POST, RAM | **LAB 02 activo**; mapa de diagnóstico de video pendiente |
| 07 POST | Secuencias de arranque, códigos específicos de placa/BIOS | LAB 02 activo; decodificador por fabricante pendiente |
| 08 RAM | Topología, módulos/ranuras, entrenamiento, XMP/EXPO y prueba por aislamiento | LAB 02 activo; árbol cruzado de módulo/slot pendiente |
| 09 CMOS/NVRAM | RTC, pila, configuración, Clear CMOS según fabricante | LAB 02 activo; bitácora de firmware pendiente |
| 10 Firmware | compatibilidad, actualización y recuperación, modos UEFI, riesgo | LAB 02 activo; simulador de decisión de flasheo pendiente |
| 11 CPU | pines/socket, VRM, señales de POST, temperaturas, compatibilidad | LAB 02/03 activos; checklist de compatibilidad pendiente |
| 12 Refrigeración | transferencia térmica, ventilación, sensores, límites por fabricante | LAB 03 activo; comparador de perfiles térmicos pendiente |
| 13 GPU | salida de video, alimentación, temperaturas, PCIe, controlador | LAB 02/03 activos; árbol de descarte GPU pendiente |
| 14 Motherboard | inspección segura, cortos, pistas, VRM, headers sin atribución especulativa | LAB 01/02 activos; guía de inspección pendiente |
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

## Alcance realmente implementado en esta etapa
- Navegación desde el Tomo 03 al banco, manteniendo el manual A4.
- Protocolos y registro manual de evidencia para los 35 módulos; rama sí/no/no probado.
- Cuatro simulaciones con decisiones contextualizadas y retroalimentación.
- Intérprete numérico de rieles ATX; sin lectura de voltajes real.
- Expediente por módulo persistido en almacenamiento local y exportación TXT; no certificado.
- Correcciones de seguridad (fuente ATX, borrado de discos, orden de controladores) y de conteo del manual.
- Regresión automatizada de Chromium nueva, que **requiere ejecución local** para afirmar PASS.

## Definición de terminado por módulo
Una ficha A4 de una página **no** satisface este contrato. Una función etiquetada «pendiente» **no** se anunciará disponible. Un botón sin resultado observable es FAIL. Para dar por completado un módulo deben existir: teoría especializada, diagrama o mapa verificable, práctica con respuestas, herramienta o medición interpretada, advertencias, procedimiento de reversión, expediente y prueba funcional. Mantener acceso adaptable para quien comienza y para el técnico experimentado.

## Prioridad técnica
**Fase A**: motor de expediente y seguridad, cuatro fallas frecuentes, regresión Chromium (implementado, esperando ejecución).
**Fase B**: especialización de 01–14 (electricidad baja tensión y arranque físico), instrumentación y árboles ramificados.
**Fase C**: 15–24 (almacenamiento, rescate, firmware y sistema), protección de datos por defecto.
**Fase D**: 25–35 (inestabilidad, telemetría, herramientas, parte de servicio y examen final).
**Fase E**: evaluación de contenidos por técnico, contraste con documentación de fabricantes, pruebas E2E escritorio/móvil y publicación. El cierre del tomo debe comprobar todas las rutas, no solo un contador de módulos.
