\# EVO LABS — REGLAS MAESTRAS DE DESARROLLO



\## 1. IDENTIDAD DEL PROYECTO

EVO LABS es una plataforma educativa, técnica y experimental sobre computadoras, Windows, hardware, redes y diagnóstico.



Lema: \*\*NO LO CREAS. COMPROBALO.\*\*



Metodología: observar → medir → experimentar → comparar → concluir.



Principio arquitectónico: \*\*REORGANIZAR ANTES QUE REESCRIBIR.\*\*



Respetar los documentos:

\- `EVO\_RECOVERY\_SOURCE\_OF\_TRUTH.md`

\- `EVO\_UNIVERSE\_OPERATING\_SYSTEM.md`

\- `EVO\_METHOD.md`



\## 2. PRESERVACIÓN OBLIGATORIA

\- Conservar los 12 tomos editoriales.

\- Conservar todos los laboratorios, simuladores, herramientas y expedientes.

\- Mantener las seis áreas canónicas: Inicio, Aprender, Practicar, Analizar mi PC, Herramientas y Mi EVO.

\- No eliminar componentes funcionales para solucionar errores.

\- No reemplazar implementaciones reales por simulaciones.

\- No modificar diseños existentes fuera del alcance solicitado.

\- Mantener compatibilidad con React, TypeScript, Vite, Express y Firebase.



\## 3. CAMBIOS CONTROLADOS

\- Ejecutar una tarea por solicitud.

\- Inspeccionar solamente los archivos relacionados con el problema.

\- Priorizar modificaciones pequeñas y localizadas.

\- No realizar refactorizaciones generales sin autorización.

\- No crear componentes duplicados si existe uno reutilizable.

\- No modificar otros tomos, laboratorios o herramientas sin necesidad.

\- No cambiar rutas de navegación canónicas sin autorización.



\## 4. ESTABILIDAD Y PRUEBAS

Antes de finalizar una modificación:

\- Verificar que TypeScript no tenga errores nuevos.

\- Comprobar que la aplicación compile.

\- Ejecutar las pruebas de regresión relevantes.

\- Utilizar la suite estructural completa cuando el cambio pueda afectar la arquitectura.

\- Informar cualquier prueba omitida o no ejecutada.

\- No afirmar que algo funciona sin evidencia.

\- No ocultar errores ni simular resultados.

\- Evitar procesos de prueba repetitivos sin justificación.



\## 5. SEGURIDAD

No modificar sin autorización explícita:

\- Firebase y sus credenciales.

\- Autenticación y permisos de usuarios.

\- Mercado Pago, pagos y suscripciones.

\- Reglas de Firestore.

\- Agente local de telemetría Windows.

\- Configuración de seguridad y acceso.



No exponer secretos, contraseñas, tokens ni credenciales en el código, los registros o GitHub.



Nunca ejecutar `git push --force`, `git reset --hard`, limpiezas destructivas ni eliminación masiva de archivos sin autorización explícita.



\## 6. TELEMETRÍA REAL

En Analizar mi PC:

\- No inventar valores de hardware.

\- No simular detecciones presentándolas como mediciones reales.

\- Diferenciar claramente datos reales, estimaciones y simulaciones.

\- Validar la comunicación con EVO Local Agent.

\- Ante errores de conexión, permisos o telemetría, mostrar información concreta.



Incidencia prioritaria conocida: el botón \*\*ACTUALIZAR DETECCIÓN\*\* debe tener respuesta visible y comprobable. Auditar su `onClick`, estados, permisos y conexión real antes de corregirlo.



\## 7. NAVEGACIÓN Y EXPERIENCIA

\- Preservar el diseño visual de EVO LABS.

\- Evitar pantallas blancas, parpadeos y bucles de renderizado.

\- El botón Volver debe respetar historial real de navegación, no desplazamientos de página.

\- Conservar estados y progreso del usuario.

\- Mantener componentes accesibles y adaptables a distintas pantallas.



\## 8. ECONOMÍA DE CUOTA DE IA

\- Evitar auditorías completas reiteradas.

\- No utilizar agentes paralelos innecesarios.

\- No recorrer cientos de archivos si el cambio afecta solamente unos pocos.

\- No generar documentación extensa cuando basta un resultado técnico breve.

\- Reutilizar información ya comprobada en la conversación.

\- Solicitar aclaración si una instrucción es ambigua antes de consumir recursos en implementaciones extensas.

\- No ejecutar tareas de larga duración que no sean necesarias.



\## 9. CONTROL DE VERSIONES

Repositorio: `EvoMaxPC/Magazine-EvoLabs`



Rama de trabajo inicial: `evo-antigravity-20261013`.



\- Conservar el historial y las ramas existentes.

\- No modificar ni fusionar `main` automáticamente.

\- No crear commits ni hacer push sin autorización.

\- No subir archivos privados ni dependencias instaladas.

\- Mantener una versión estable recuperable antes de cambios importantes.



\## 10. INFORME DE CADA TAREA

Responder en español, de manera breve y técnica.



Al finalizar informar:

1\. Qué se modificó.

2\. Qué archivos se tocaron.

3\. Qué pruebas se ejecutaron y sus resultados.

4\. Qué problemas quedan pendientes.



No declarar una tarea finalizada mientras existan errores conocidos relacionados con ella.



\*\*REGLA FINAL:\*\* preservar lo que funciona, corregir lo que falla y demostrar cada resultado. La estabilidad de EVO LABS tiene prioridad sobre la velocidad de implementación.

