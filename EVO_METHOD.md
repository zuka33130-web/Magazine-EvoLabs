# EVO METHOD // UNIVERSAL TECH LEARNING PROTOCOL
**Versión:** 1.0.0 Canónica  
**Ámbito:** Arquitectura Pedagógica y Metrológica Universal EVO LABS  
**Filosofía Central:** *"Hacemos milagros, pero los medimos. El aprendizaje técnico no culmina al memorizar o seguir una receta: culmina cuando podés transferir el principio a un problema nuevo."*

---

## 1. El Ciclo Universal en 9 Etapas

Todo proceso de aprendizaje, diagnóstico o intervención en ingeniería técnica dentro de EVO LABS se rige por un ciclo estricto de 9 etapas determinísticas:

```
[1. OBSERVAR] ───► [2. ENTENDER] ───► [3. HIPOTETIZAR]
        ▲                                     │
        │                                     ▼
[9. TRANSFERIR] ◄── [8. DOCUMENTAR] ◄── [4. INTERVENIR]
        ▲                                     │
        │                                     ▼
[7. COMPROBAR]  ◄─── [6. COMPARAR]  ◄─── [5. MEDIR]
```

---

### Descripción de las 9 Etapas

| # | Etapa | Definición Pericial | Pregunta Central |
|---|---|---|---|
| **1** | **OBSERVAR** | Captura inicial de síntomas, comportamiento anómalo, estado del sistema o telemetría visible sin prejuicios ni conclusiones apresuradas. | *¿Qué está ocurriendo exactamente y qué señales emite el sistema?* |
| **2** | **ENTENDER** | Análisis de la arquitectura subyacente, topología y flujo del dato involucrado (cómo debería operar el sistema en estado nominal). | *¿Cuál es el modelo causal y qué componentes o capas intervienen?* |
| **3** | **HIPOTETIZAR** | Formulación de una matriz de hipótesis paralelas explicativas ordenadas por probabilidad empírica. Cero causa directa prematura. | *¿Qué posibles causas explican la evidencia observada?* |
| **4** | **INTERVENIR** | Ejecución de una acción técnica aislada, controlada y reproducible (cambio de parámetro, sustitución, parche, comando o ajuste). | *¿Qué variable específica se modifica para verificar o descartar?* |
| **5** | **MEDIR** | Registro metrológico con instrumental directo (WMI, sensores, multímetro, logs, osciloscopio, profiler) con procedencia explícita. | *¿Qué valor exacto y qué nivel de procedencia arroja la lectura?* |
| **6** | **COMPARAR** | Contraste riguroso A/B (Antes vs Después). Qué mejoró, qué empeoró y qué variables permanecieron invariantes. | *¿Cuál es el delta de cambio medido frente a la línea base?* |
| **7** | **COMPROBAR** | Verificación de estabilidad bajo estrés y descarte definitivo de falsos positivos o correlaciones espurias. | *¿La solución resuelve la causa raíz de forma robusta y reproducible?* |
| **8** | **DOCUMENTAR** | Registro formal de la intervención en el expediente pericial con procedencia de datos, pasos y justificación epistémica. | *¿Queda constancia auditable sin datos inventados ni sesgos?* |
| **9** | **TRANSFERIR** | **El verdadero cierre.** Extrapolación del principio fundamental a un escenario, arquitectura o problema completamente nuevo. | *¿Podés aplicar este principio a un sistema distinto que jamás viste?* |

---

## 2. Aplicabilidad Universal en 8 Dominios Técnicos

El **EVO METHOD** es un protocolo isomórfico aplicable transversalmente a cualquier disciplina tecnológica:

### 1. Hardware & Silicio
- **Observar:** Micro-stutters y reinicios esporádicos.
- **Entender:** Topología PCIe, fases VRM y curvas térmicas de CPU.
- **Hipotetizar:** Thermal Throttling en TJMax vs caída de voltaje en rail 12V.
- **Intervenir:** Reemplazo de interfaz de transferencia térmica.
- **Medir:** Temperaturas Tdie (°C) y frecuencias de boost con HWInfo64.
- **Comparar:** 89.4°C @ 3.8GHz (Antes) vs 68.1°C @ 4.65GHz (Después).
- **Comprobar:** 2 horas de AIDA64 FPU stress sin caídas de frecuencia.
- **Documentar:** Expediente pericial con procedencia `MEASURED`.
- **Transferir:** *¿Cómo aplicarías este mismo principio de disipación a los VRMs de una GPU de workstation o un inversor solar?*

### 2. Windows & Kernel NT
- **Observar:** Pantallazo azul BugCheck `0x00000124 (WHEA_UNCORRECTABLE_ERROR)`.
- **Entender:** Frontera Ring 0 vs Ring 3, ISR (Interrupt Service Routines) y colas DPC.
- **Hipotetizar:** Driver `nvlddmkm.sys` desactualizado vs falla en controlador PCIe.
- **Intervenir:** Limpieza con DDU en Modo Seguro e instalación de driver WHQL verificado.
- **Medir:** Latencia DPC con LatencyMon (µs) y auditoría de Event Viewer.
- **Comparar:** 2,840 µs (Antes) vs 145 µs (Después).
- **Comprobar:** Ejecución en tiempo real con 0 cortes de audio o frames congelados.
- **Documentar:** Registro en bitácora de administración de Windows.
- **Transferir:** *¿Cómo diagnosticarías una latencia similar en un servidor Linux con interrupciones hardware `ksoftirqd`?*

### 3. Redes & Comunicaciones
- **Observar:** Pérdida intermitente de paquetes y latencia errática en llamadas VoIP.
- **Entender:** Modelo OSI (Capa 2 / 3), colas QoS, MTU y resolución DNS.
- **Hipotetizar:** Fragmentación de paquetes por MTU excesivo vs colisión en switch.
- **Intervenir:** Ajuste de MTU a 1492 y priorización DSCP en router.
- **Medir:** Ping RTT, Jitter (ms) y capturas Wireshark con procedencia `MEASURED`.
- **Comparar:** Jitter de 48ms y 4% loss (Antes) vs Jitter 2ms y 0% loss (Después).
- **Comprobar:** Carga saturada de red con VoIP simultáneo sin degradación.
- **Documentar:** Diagrama de topología y reporte de calidad de enlace.
- **Transferir:** *¿Cómo aplicarías este control de congestión en una red de sensores IoT sobre protocolo MQTT?*

### 4. Ciberseguridad & Análisis Forense
- **Observar:** Tráfico saliente anómalo en puerto no estándar a las 03:00 AM.
- **Entender:** Mecanismos de persistencia en registro, tareas programadas y C2 (Command & Control).
- **Hipotetizar:** Inyección de proceso en `svchost.exe` vs binario malicioso en AppData.
- **Intervenir:** Aislamiento de host de red y volcado de memoria RAM.
- **Medir:** Hashes SHA-256 de ejecutables, conexiones TCP activas (`netstat -ano`).
- **Comparar:** Baseline nominal de conexiones del sistema vs conexiones tras la infección.
- **Comprobar:** Desinfección, revocación de tokens y auditoría de eventos de autenticación.
- **Documentar:** Cadena de custodia pericial e informe de incidente.
- **Transferir:** *¿Cómo detectarías una técnica de evasión análoga en un clúster de Kubernetes usando contenedores efímeros?*

### 5. Reparación & Electrónica
- **Observar:** Placa madre no enciende (no POST, ventiladores apagados).
- **Entender:** Rieles de Standby (5VSB, 3.3VSB), chip Super I/O y circuito RTC.
- **Hipotetizar:** Cortocircuito en línea principal de 12V vs cristal oscilador descalibrado.
- **Intervenir:** Inyección de voltaje controlado de 1V con cámara térmica / multímetro.
- **Medir:** Caída de tensión en diodos y consumo en amperios (A).
- **Comparar:** Consumo nominal de standby (<20mA) vs consumo medido previo (1.8A).
- **Comprobar:** Sustitución de capacitor cerámico en corto; arranque nominal del equipo.
- **Documentar:** Esquemático anotado de la placa con los puntos de test medidos.
- **Transferir:** *¿Cómo aplicarías la técnica de inyección de tensión para hallar un corto en la línea de backlight de una pantalla OLED?*

### 6. Programación & Algoritmia
- **Observar:** Consulta de base de datos demora 8.4 segundos bajo 500 usuarios concurrentes.
- **Entender:** Complejidad algorítmica $O(N^2)$, planes de ejecución de base de datos y memoria caché.
- **Hipotetizar:** Full Table Scan por falta de índice compuesto vs N+1 queries en ORM.
- **Intervenir:** Creación de índice B-Tree en columnas filtradas y reescritura de query.
- **Medir:** Tiempo de respuesta del servidor (ms) y uso de CPU en DBMS.
- **Comparar:** 8,400ms (Antes) vs 12ms (Después) con reducción de 98% en I/O.
- **Comprobar:** Test de carga concurrente con 2,000 peticiones por segundo.
- **Documentar:** PR con benchmark y análisis del plan de ejecución (EXPLAIN ANALYZE).
- **Transferir:** *¿Cómo optimizarías una estructura de datos en memoria en Rust/C++ cuando el cuello de botella es el fallo de caché L3 (cache misses)?*

### 7. Inteligencia Artificial & Modelos
- **Observar:** Alucinaciones recurrentes del modelo al responder sobre regulaciones técnicas locales.
- **Entender:** Mecanismo de atención de transformadores, ventana de contexto y técnica RAG.
- **Hipotetizar:** Chunking defectuoso en base vectorial vs temperatura de muestreo alta (>0.7).
- **Intervenir:** Reducción de chunk size a 256 tokens con overlap de 50 y temperatura a 0.0.
- **Medir:** Precision@K, Recall y puntaje de factualidad semántica.
- **Comparar:** 62% factualidad (Antes) vs 96% factualidad (Después).
- **Comprobar:** Batería de 100 consultas periciales con validación humana cruzada.
- **Documentar:** Matriz de evaluación del pipeline RAG y versión del embedding.
- **Transferir:** *¿Cómo adaptarías este control de factualidad a un sistema de agentes autónomos que ejecutan llamadas a APIs externas?*

### 8. Electrónica de Potencia & Fuentes
- **Observar:** Fuente de alimentación entra en protección OCP/OPP al iniciar carga gráfica.
- **Entender:** Transitorios de consumo rápido (Power Spikes) en GPUs modernas y respuesta del lazo PWM.
- **Hipotetizar:** Disparo falso por sensibilidad de sensor shunt vs saturación de inductor.
- **Intervenir:** Configuración de rail único + cableado PCIe independiente por conector.
- **Medir:** Rizado de voltaje pico a pico con osciloscopio digital (mVpp).
- **Comparar:** Rizado de 180mVpp con micro-cortes (Antes) vs 35mVpp estable (Después).
- **Comprobar:** Burn-in test combinado FurMark + Prime95 durante 60 minutos.
- **Documentar:** Gráfica de transitorios de osciloscopio firmada en expediente.
- **Transferir:** *¿Cómo analizarías los transitorios de arranque en la etapa de potencia de un variador de frecuencia industrial?*

---

## 3. La Regla de Oro de la Transferencia

> **"Completar una lección o aprobar un examen no demuestra dominio. El dominio se demuestra cuando sos capaz de aplicar la ley fundamental que aprendiste a un sistema que nunca viste antes."**

En el **EVO METHOD**, cada Tomo, Laboratorio y Caso concluye con un **Desafío de Transferencia Cognitiva**. El estudiante debe resolver una situación análoga en un entorno diferente demostrando que no memorizó una receta, sino que comprende la causalidad del sistema.

---

## 4. Compromiso Anti-Gamificación y Rigor Metrológico

1. **Cero Puntos de Experiencia Arbitrarios:** Los avances se expresan únicamente en capacidades demostradas y evidencias registradas.
2. **Procedencia Obligatoria:** Todo dato se acompaña de su nivel (`SYSTEM_REPORTED`, `MEASURED`, `CALCULATED`, `ESTIMATED`, `SIMULATED`, `UNKNOWN`).
3. **Reproducibilidad:** Si una medición o solución no puede ser reproducida por otro técnico siguiendo el expediente, carece de validez pericial.

---

*EVO LABS // Campus Central Mundo EVO*
