# EVO LABS // UNIVERSE OPERATING SYSTEM (CANONICAL)
**Versión de Especificación**: 1.0.0-PRO  
**Branch Activo**: `evo-recovery-pro`  
**Branding Principal Oficial**: `EVO LABS` (Se prohíbe el uso de "Academia EVO LABS" en interfaces activas)

---

## 1. IDENTIDAD Y BRANDING
- **Nombre Canónico**: **EVO LABS**
- **Descriptor de Sistema**: Sistema de Aprendizaje Tecnológico / Plataforma Pericial de Computadoras
- **Lema Institucional**: *"NO LO CREAS. COMPROBALO."*
- **Público Objetivo**: Desde usuarios iniciales sin conocimientos previos hasta profesionales de infraestructura, peritaje informático y kernel.

---

## 2. ARQUITECTURA DE ENTRADA // INTRO ÚNICA
- **Componente Oficial Activo**: `EvoIntroExperience.tsx` integrado en `App.tsx`.
- **Estructura Estricta de 4 Escenas**:
  1. **QUÉ ES EVO**: Bienvenida al sistema, propósito de aprendizaje sobre hardware y sistema operativo real.
  2. **CÓMO EVOLUCIONÁS**: Metodología pericial de 5 fases: `ENTENDER` ➔ `OBSERVAR` ➔ `PRACTICAR` ➔ `DIAGNOSTICAR` ➔ `COMPROBAR`.
  3. **QUÉ EXISTE DENTRO**: Presentación panorámica de los 5 Universos EVO.
  4. **ENTRAR**: Acción dominante `INGRESAR A MUNDO EVO →` + acción secundaria `Comenzar Tomo 01: Conocé tu PC`, persistencia de preferencia de omisión por usuario.
- **Controles de Interacción**:
  - Teclado universal: `[←]` Anterior | `[→]` o `[Espacio]` Siguiente | `[Esc]` Omitir.
  - Indicador de estado de 4 pasos visibles.

---

## 3. NAVEGACIÓN GLOBAL Y LAS 6 DESTINACIONES
La barra de navegación principal presenta exclusivamente las 6 áreas canónicas:

1. **INICIO** (`world-map` / `campus`):
   - Centro de Operaciones generales de EVO LABS.
   - Primer nivel jerárquico:
     - `CONTINUAR MI EVOLUCIÓN // SIGUIENTE MEJOR ACCIÓN` (acción dominante destacada con radar pericial y estado persistido).
     - `ESTADO ACTUAL // SISTEMA EVO` (telemetría compacta en tiempo real).
     - `5 ÁREAS PRINCIPALES // UNIVERSO EVO` (instrumental modular interconectado).
2. **APRENDER** (`escuela` / `biblioteca`):
   - Colección canónica de los 10 Tomos con sus portadas y especificaciones pedagógicas.
   - Alternancia ágil con la Ruta Formativa por Niveles (0 al 6).
3. **PRACTICAR** (`laboratorios`):
   - Suite completa de laboratorios clasificada por propósito operativo: `Todos`, `Guiados`, `Simuladores`, `Experimentos`, `Casos`.
4. **ANALIZAR MI PC** (`diagnosticar`):
   - Estación de diagnóstico técnico, escáner de silicio y consola de incidentes con criterio de procedencia `SYSTEM_REPORTED`.
5. **HERRAMIENTAS** (`herramientas`):
   - Catálogo de utilidades de auditoría independientes (Windows, Hardware, Rendimiento, Diagnóstico, Terminal).
6. **MI EVO** (`progreso`):
   - Pasaporte pericial del usuario, historial de actas forenses, avance correlativo y certificaciones emitidas.

---

## 4. SISTEMA DE DISEÑO Y JERARQUÍA COGNITIVA
- **Tipografías Canónicas**:
  - `Epilogue`: Títulos principales, cubiertas editoriales y jerarquía display (`.font-display`).
  - `Plus Jakarta Sans`: Textos de lectura editorial, explicaciones y cuerpo (`.font-sans-editorial`).
  - `JetBrains Mono`: Telemetría, métricas, código, terminales y badges técnicos (`.font-mono-tech`).
- **Disciplina Visual**:
  - Una sola acción dominante (CTA) por pantalla principal.
  - Máximo dos acciones secundarias al mismo nivel.
  - Prohibido acumular botones ambiguos, duplicados o callejones sin salida.

---

## 5. TUTOR EVO // ASISTENCIA COGNITIVA TRANSVERSAL
- El Tutor EVO acompaña de manera ubicua y contextual a través de su drawer deslizable y su disparador flotante.
- No compite como pestaña ni desplaza las 6 áreas de navegación principal.
- Ofrece glosario de términos de bajo nivel, orientación de siguiente paso y advertencias periciales.

---

## 6. SEGURIDAD Y TELEMETRÍA LOCAL // EVO AGENT
- Conexión restringida a `127.0.0.1:43921`.
- Ejecución segura con allowlist estricta de comandos.
- Respeto total al principio de no suposición: si un parámetro no puede ser verificado por hardware o API de kernel, su valor es taxativamente `UNKNOWN`.
