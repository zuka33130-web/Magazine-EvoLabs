# EVO LABS // RECOVERY SOURCE OF TRUTH (CANONICAL)
**Versión de Referencia**: 1.0.0-PRO  
**Rama activa canónica**: `main` (documento iniciado históricamente en `evo-recovery-pro`)  
**Última Auditoría**: TRANSFORMACIÓN 01 — INTEGRITY GATE  

---

## 1. PRINCIPIO FUNDAMENTAL
> **"REORGANIZAR > REESCRIBIR."**  
> **"SIMPLE POR FUERA. PROFUNDO POR DENTRO."**  
> **"NO LO CREAS. COMPROBALO."**

La misión de EVO LABS no es destruir código funcional ni reiniciar arquitecturas desde cero, sino organizar, jerarquizar y elevar lo existente para que un usuario sin conocimientos previos comprenda inmediatamente dónde está, y un usuario técnico avanzado pueda profundizar hasta el nivel de Kernel, silicio y peritaje forense.

---

## 2. PROHIBICIONES ESTRICTAS (ZERO REGRESSION)
Queda estrictamente prohibido en cualquier transformación:
1. **Perder Progreso**: Conservar estado de avance, módulos aprobados y exámenes.
2. **Resetear LocalStorage**: Mantener intactas las claves de almacenamiento (`evo_academia_intro_dismissed`, capítulos completados, expedientes guardados, hardware detectado).
3. **Eliminar Rutas o Deep Links**: Todas las rutas y handlers de navegación interna deben permanecer accesibles.
4. **Degradar Simuladores o Labs**: Conservar la suite de laboratorios completa (Windows Matrix, Boot Lab, PCB Canvas, Sector 02 Hot-Swap, Consola de Incidentes, Ultimate Sandbox).
5. **Alterar la Filosofía de Telemetría**: La procedencia de datos debe ser verificable. Lo medido por el agente se categoriza como `SYSTEM_REPORTED`; lo no comprobable con rigor se clasifica estrictamente como `UNKNOWN`. Nunca inventar o adivinar datos.

---

## 3. INVENTARIO DE SUBSISTEMAS CANÓNICOS PROTEGIDOS

### 3.1. Núcleo Editorial y Tomos
- **Tomo 01: Conocé tu PC**: 7 capítulos didácticos, laboratorio final de comprobación metrológica, examen de certificación teórica y práctica (umbral 70%), diploma pericial descargable.
- **Tomo 02: La Biblia Negra de Windows**: Arquitectura del Kernel NT, subsistemas de memoria, registro, servicios y telemetría de rendimiento.
- **Colección Canónica de 10 Tomos**: Títulos y perfiles pedagógicos preservados en `VOLUMES_COLLECTION`.

### 3.2. Suite de Laboratorios y Prácticas
- **Laboratorios Guiados**: Flujos interactivos paso a paso con hipótesis, medición y conclusión.
- **Simuladores de Hardware**: Esquemáticos de placa madre, líneas de cobre, hot-swap de componentes, bancos de prueba de memoria y almacenamiento.
- **Experimentos Libres**: Entornos sin riesgo para comprobación de hipótesis.
- **Casos Forenses y Expedientes**: Taller pericial con síntomas reales, árbol de descarte y actas de resolución firmadas.

### 3.3. EVO Core y EVO Agent
- **EVO Core**: Análisis de máquina local en tiempo real con diagnóstico estricto.
- **EVO Agent**: Servicio nativo local (`http://127.0.0.1:43921`), política de seguridad localhost-only, allowlist de endpoints y modelo de procedencia estricto.

### 3.4. Tutor EVO
- Motor de acompañamiento pedagógico global (drawer retráctil, botón flotante y barra contextual).
- Proporciona orientación pericial sin invadir la navegación ni competir como una sección aislada.

---

## 4. ESTÁNDAR DE VERIFICACIÓN
Todo cambio debe superar de manera obligatoria:
- `npx tsc --noEmit`: 0 errores de tipos TypeScript.
- `npm run build`: Compilación de producción limpia en Vite sin fallos de Rollup.
- `Dev Server Preview`: HTTP 200 OK en puerto 3000.
