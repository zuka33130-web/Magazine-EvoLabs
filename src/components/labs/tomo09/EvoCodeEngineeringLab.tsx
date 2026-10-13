// ============================================================================
// EVO LABS // TOMO 09: EVO CODE ENGINEERING LAB
// 09A Logic Visualizer | 09B Debugger Lab | 09C Algorithm Bench
// 09D Data Flow Lab | 09E Git Timeline | 09F Test Lab + 5 Casos Guiados
// ============================================================================

import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bug,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileCode,
  FileText,
  GitBranch,
  GitCommit,
  GitMerge,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';
import { EvoLabFramework } from '../framework/EvoLabFramework';
import {
  DataOrigin,
  GuidedCase,
  SubLabModule,
  VerdictType,
} from '../framework/types';

interface EvoCodeEngineeringLabProps {
  onClose?: () => void;
}

const TOMO_09_SUBLABS: SubLabModule[] = [
  {
    id: '09a-logic',
    code: '09A',
    title: 'LOGIC VISUALIZER // EJECUCIÓN PASO A PASO',
    subtitle: 'Inspección de memoria, pila de llamadas (Call Stack) y ámbito de variables',
    category: 'EJECUCIÓN ALGORÍTMICA',
    description:
      'Observá la máquina virtual en acción. Ejecutá algoritmos paso a paso visualizando cómo cambian las variables en el Stack y el Heap, las bifurcaciones condicionales y los contadores de bucle en cada ciclo.',
    standardReference: 'ECMAScript 2026 Specification / V8 Execution Engine Spec',
    systemVariables: [
      { name: 'Paso de Ejecución', description: 'Instrucción atómica activa en el puntero de programa (PC)' },
      { name: 'Variables en Ámbito Local', description: 'Valores en el marco de pila (Stack Frame)' },
      { name: 'Contador de Iteración', description: 'Progreso y condición de parada del bucle' },
    ],
    metrics: [
      {
        key: 'execution_steps',
        name: 'Pasos de Ejecución Atómicos',
        unit: 'instrucciones',
        whatIsIt: 'Cantidad de transformaciones de estado necesarias para completar la rutina.',
        whereItComesFrom: 'Contador de instrucciones del evaluador de AST.',
        whatItMeans: 'Complejidad procedimental del algoritmo.',
        whatItDoesNotMean: 'No es el tiempo en microsegundos de CPU.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La evolución temporal del estado de la memoria en cada instrucción.',
      whyItMatters: 'Comprender qué contiene una variable en la línea 4 antes de que se ejecute la línea 5 previene el 90% de los bugs de principiante.',
      whatCanBeConcluded: 'Las variables declaradas dentro de un bloque `if` con `let`/`const` mueren al cerrar la llave (ámbito léxico de bloque).',
      whatCannotBeConcluded: 'Que un código compile sin errores de sintaxis no significa que su lógica sea correcta.',
      evoGoldenRule: 'REGLA EVO: El código hace lo que escribiste, no lo que tenías en mente.',
    },
  },
  {
    id: '09b-debugger',
    code: '09B',
    title: 'DEBUGGER LAB // AUDITORÍA EXPECTED VS ACTUAL',
    subtitle: 'Banco de depuración pericial con breakpoints y análisis de diferencias',
    category: 'DEPURACIÓN FORENSE',
    description:
      'Localizá errores de lógica clásicos (Off-by-one, mutación inadvertida de arrays, promesas no esperadas). Compará el resultado obtenido (Actual) frente al contrato especificado (Expected).',
    standardReference: 'IEEE Standard for Software Unit Testing (IEEE 1008-1987)',
    systemVariables: [
      { name: 'Caso de Prueba', description: 'Suma de arrays, extracción de usuarios activos, cálculo de promedio' },
      { name: 'Estado de Corrección', description: 'Código bugueado original vs Corrección pericial aplicada' },
    ],
    metrics: [
      {
        key: 'bug_resolution_rate',
        name: 'Resolución de Contrato Lógico',
        unit: '%',
        whatIsIt: 'Porcentaje de aserciones que pasan exitosamente tras corregir el bug.',
        whereItComesFrom: 'Comparación determinista `Expected === Actual`.',
        whatItMeans: 'Fidelidad del código respecto a la especificación técnica.',
        whatItDoesNotMean: 'No garantiza optimización de velocidad.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La discrepancia exacta entre el comportamiento real del código y su especificación.',
      whyItMatters: 'Usar `array.length` en lugar de `array.length - 1` en bucles indexados accede a memoria indefinida (`undefined`).',
      whatCanBeConcluded: 'Un breakpoint permite pausar en el momento exacto donde la variable toma un valor inesperado.',
      whatCannotBeConcluded: 'No uses `console.log` a ciegas: un debugger pericial muestra el contexto completo sin modificar el archivo.',
      evoGoldenRule: 'REGLA EVO: Formula una hipótesis sobre la causa del error antes de cambiar una sola línea de código.',
    },
  },
  {
    id: '09c-algorithm-bench',
    code: '09C',
    title: 'ALGORITHM BENCH // BIG-O & COMPLEJIDAD',
    subtitle: 'Comparativa de escalado: O(1) vs O(n) vs O(n log n) vs O(n²)',
    category: 'COMPLEJIDAD COMPUTACIONAL',
    description:
      'Medí el número de operaciones y la degradación de tiempo al aumentar el tamaño del dataset de $N=10$ a $N=100,000$. Comprobá por qué un algoritmo $O(n^2)$ congela la aplicación mientras $O(n \\log n)$ responde en 2 milisegundos.',
    standardReference: 'Algorithm Complexity Theory / ACM Standard Algorithmic Benchmarks',
    systemVariables: [
      { name: 'Tamaño del Dataset (N)', description: 'N = 10 / N = 100 / N = 1,000 / N = 10,000 elementos' },
      { name: 'Algoritmo Seleccionado', description: 'Búsqueda Lineal $O(n)$ vs Búsqueda Binaria $O(\\log n)$ vs Hash Map $O(1)$' },
    ],
    metrics: [
      {
        key: 'operation_count',
        name: 'Operaciones de Comparación',
        unit: 'ops',
        whatIsIt: 'Cantidad de comparaciones elementales ejecutadas por la CPU para resolver la consulta.',
        whereItComesFrom: 'Contador determinista en bucles de iteración.',
        whatItMeans: 'Carga computacional intrínseca que no depende de la velocidad del procesador.',
        whatItDoesNotMean: 'No es memoria RAM consumida.',
        formulaOrDetail: 'Big-O Analysis: f(N)',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'Cómo escala el esfuerzo de cálculo a medida que crecen los datos.',
      whyItMatters: 'Un algoritmo $O(n^2)$ funciona bien con 10 usuarios en pruebas, pero colapsa el servidor con 10,000 usuarios en producción.',
      whatCanBeConcluded: 'Para $N=1,000,000$, la búsqueda binaria requiere solo ~20 operaciones, frente a 1,000,000 de la lineal.',
      whatCannotBeConcluded: 'Tener una CPU más potente no soluciona un algoritmo $O(n^2)$ mal diseñado.',
      evoGoldenRule: 'REGLA EVO: La eficiencia algorítmica supera a la fuerza bruta del hardware.',
    },
  },
  {
    id: '09d-data-flow',
    code: '09D',
    title: 'DATA FLOW LAB // MAP, FILTER & REDUCE',
    subtitle: 'Canalización visual de transformaciones puras en estructuras JSON y arrays',
    category: 'PROGRAMACIÓN FUNCIONAL',
    description:
      'Construí canalizaciones de datos inmutables. Observá cómo un array de telemetría sin procesar se filtra (`filter`), se enriquece (`map`) y se consolida (`reduce`) en un informe sin mutar la fuente original.',
    standardReference: 'Functional Programming Principles & JSON Schema Specification',
    systemVariables: [
      { name: 'Etapa de Pipeline', description: 'Raw Input -> Filter (Condición) -> Map (Transformación) -> Reduce (Agregación)' },
      { name: 'Inmutabilidad', description: 'Garantía de que el array de entrada permanece idéntico en memoria' },
    ],
    metrics: [
      {
        key: 'pipeline_throughput',
        name: 'Elementos Transformados',
        unit: 'ítems',
        whatIsIt: 'Cantidad de registros procesados a través de las 3 etapas del pipeline.',
        whereItComesFrom: 'Conteo de elementos emitidos por la función reduce final.',
        whatItMeans: 'Volumen de datos condensados en información de diagnóstico útil.',
        whatItDoesNotMean: 'No mide el tiempo de respuesta.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'El flujo determinista de datos a través de funciones puras.',
      whyItMatters: 'Mutar arrays compartidos (`array.push()`) causa efectos secundarios invisibles que rompen otros módulos.',
      whatCanBeConcluded: 'Las cadenas `.filter().map().reduce()` son deterministas, testeables y no mutan el estado global.',
      whatCannotBeConcluded: 'No anides 10 métodos si una sola pasada puede consolidar el resultado.',
      evoGoldenRule: 'REGLA EVO: Entrada inmutable + Funciones puras = Código sin efectos colaterales.',
    },
  },
  {
    id: '09e-git-timeline',
    code: '09E',
    title: 'GIT TIMELINE // GRAFO DE COMMITS & MERGES',
    subtitle: 'Simulador visual de ramas, commits atómicos y resolución de conflictos',
    category: 'CONTROL DE VERSIONES',
    description:
      'Visualizá el grafo acíclico dirigido (DAG) de Git. Experimentá con commits atómicos, creación de ramas (`feature`), fusiones Fast-Forward y resolución controlada de conflictos de merge.',
    standardReference: 'Git Internal Object Model (Blob, Tree, Commit, Ref)',
    systemVariables: [
      { name: 'Rama Activa (HEAD)', description: 'main vs feature-login vs hotfix-vrm' },
      { name: 'Tipo de Merge', description: 'Fast-Forward (Avance directo) vs 3-Way Merge Commit' },
    ],
    metrics: [
      {
        key: 'commit_count',
        name: 'Nodos en Grafo Git',
        unit: 'commits',
        whatIsIt: 'Cantidad de instantáneas inmutables registradas con hash SHA-1/SHA-256.',
        whereItComesFrom: 'Recorrido del árbol de commits desde HEAD hasta el origen.',
        whatItMeans: 'Historial auditable y capacidad de reversión determinista.',
        whatItDoesNotMean: 'No indica líneas de código escritas.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La estructura topológica del historial de cambios de un proyecto.',
      whyItMatters: 'Un conflicto ocurre cuando dos desarrolladores modifican las mismas líneas en la misma rama base.',
      whatCanBeConcluded: 'Un commit atómico debe contener un solo cambio lógico con un mensaje explicativo claro.',
      whatCannotBeConcluded: 'Hacer `git push --force` en main destruye el historial de trabajo del equipo.',
      evoGoldenRule: 'REGLA EVO: Commits pequeños y frecuentes hacen que resolver conflictos sea trivial.',
    },
  },
  {
    id: '09f-test-lab',
    code: '09F',
    title: 'TEST LAB // PRUEBAS UNITARIAS & COBERTURA',
    subtitle: 'Ejecución de assertions deterministas: PASS, FAIL y cobertura de código',
    category: 'VERIFICACIÓN METROLÓGICA',
    description:
      'El laboratorio final: comprobá por qué un test aporta evidencia pericial irrefutable. Ejecutá una suite de pruebas unitarias sobre funciones críticas de cálculo de telemetría y verificá el 100% de cobertura de ramas.',
    standardReference: 'Vitest / Jest Testing Specification / Code Coverage Standards',
    systemVariables: [
      { name: 'Suite de Tests', description: 'Cálculo de Frametimes, Sanitización de IP, Conversión de Unidades' },
      { name: 'Casos Límite (Edge Cases)', description: 'Array vacío, valores nulos, números negativos, desbordamiento' },
    ],
    metrics: [
      {
        key: 'test_pass_rate',
        name: 'Tasa de Aprobación de Tests',
        unit: '%',
        whatIsIt: 'Porcentaje de aserciones que validaron exitosamente sin excepciones.',
        whereItComesFrom: 'Ejecución del runner de pruebas sobre el módulo bajo test.',
        whatItMeans: 'Nivel de confianza matemática en la solidez del software.',
        whatItDoesNotMean: 'No garantiza que no existan requisitos de negocio faltantes.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La conformidad estricta del código contra una batería de casos de prueba reproducibles.',
      whyItMatters: 'Un buen test prueba tanto el camino feliz (Happy Path) como los casos límite donde el usuario ingresa basura.',
      whatCanBeConcluded: 'Si todos los tests pasan, podés refactorizar el código con total seguridad de no romper nada existente.',
      whatCannotBeConcluded: '100% de cobertura no significa 0 bugs si los tests no verifican los casos límite críticos.',
      evoGoldenRule: 'REGLA EVO: No lo creas. Escribí un test automatizado y comprobalo.',
    },
  },
];

const TOMO_09_GUIDED_CASES: GuidedCase[] = [
  {
    id: 'case-09-01',
    caseNumber: 'CASO 01',
    title: 'Error Off-By-One en paginación que arroja pantalla en blanco en última página',
    symptom: 'Al hacer clic en la página 5 de resultados, la interfaz muestra `TypeError: Cannot read properties of undefined`.',
    evidence: 'El bucle de renderizado utiliza `i <= totalPages` en un array con índices de `0` a `totalPages - 1`.',
    hypothesis: 'La última iteración intenta acceder a `items[5]` en un array de longitud 5, retornando `undefined`.',
    testAction: 'Corregir la condición de parada a `i < totalPages` en el Debugger Lab.',
    resultSummary: '100% de páginas renderizadas sin excepciones; prueba unitaria pasa en verde.',
    conclusion: 'Los arrays en base 0 exigen `< length` en lugar de `<= length`.',
    targetSubLabId: '09b-debugger',
  },
  {
    id: 'case-09-02',
    caseNumber: 'CASO 02',
    title: 'Mutación inadvertida de objeto de usuario en memoria que altera el estado global',
    symptom: 'Al modificar el perfil de un usuario temporal, el perfil del usuario administrador también cambia.',
    evidence: 'El código asigna `const userCopy = originalUser;` copiando la referencia de memoria en el Heap.',
    hypothesis: 'Ambas variables apuntan a la misma dirección física; mutar una altera la otra inmediatamente.',
    testAction: 'Implementar copia inmutable con el operador spread `{ ...originalUser }` o `structuredClone`.',
    resultSummary: 'Objetos desacoplados en memoria; mutación aislada comprobada.',
    conclusion: 'En JavaScript los objetos se pasan por referencia. Para independizarlos debe realizarse una copia superficial o profunda.',
    targetSubLabId: '09a-logic',
  },
  {
    id: 'case-09-03',
    caseNumber: 'CASO 03',
    title: 'Degradación a 4,500 ms por búsqueda anidada O(n²) sobre 10,000 registros',
    symptom: 'La búsqueda de dispositivos en el inventario congela la pestaña del navegador durante 4.5 segundos.',
    evidence: 'Se utiliza un `array.find()` dentro de un bucle `forEach`, generando $10,000 \\times 10,000 = 100,000,000$ operaciones.',
    hypothesis: 'Complejidad cuadrática $O(n^2)$. Indexar previamente los elementos en un `Map` reducirá la búsqueda a $O(1)$.',
    testAction: 'Transformar el array a `Map` y ejecutar la comparativa en el Algorithm Bench.',
    resultSummary: 'Tiempo de ejecución desciende de 4,500 ms a 1.8 ms (reducción del 99.96%).',
    conclusion: 'El uso de estructuras de datos hash ($O(1)$) erradica los cuellos de botella de algoritmos cuadráticos.',
    targetSubLabId: '09c-algorithm-bench',
  },
  {
    id: 'case-09-04',
    caseNumber: 'CASO 04',
    title: 'Fallo de procesamiento en pipeline por mutación de array con `splice`',
    symptom: 'Al filtrar elementos inactivos, el array original pierde elementos de forma impredecible en llamadas posteriores.',
    evidence: 'Se utilizó `array.splice()` que muta el arreglo in-place en lugar de `.filter()` que retorna un nuevo array.',
    hypothesis: 'Reemplazar mutaciones directas por funciones puras en el Data Flow Lab restaurará la consistencia.',
    testAction: 'Construir pipeline funcional inmutable con `.filter()` y `.map()`.',
    resultSummary: 'Pipeline 100% puro; estado de entrada preservado sin efectos colaterales.',
    conclusion: 'La inmutabilidad funcional garantiza predictibilidad y elimina bugs por estados compartidos.',
    targetSubLabId: '09d-data-flow',
  },
  {
    id: 'case-09-05',
    caseNumber: 'CASO 05',
    title: 'Conflicto de fusión en Git por modificación simultánea de constantes de versión',
    symptom: '`git merge feature` se detiene con error `CONFLICT (content): Merge conflict in version.ts`.',
    evidence: 'Ambas ramas modificaron la línea 12 con números de versión incompatibles.',
    hypothesis: 'El modelo de 3 vías de Git requiere que el desarrollador elija explícitamente el cambio final.',
    testAction: 'Resolver el conflicto en el Git Timeline seleccionando la versión más reciente y confirmando el commit.',
    resultSummary: 'Grafo de ramas consolidado; historial limpio y lineal.',
    conclusion: 'Los conflictos de merge no son errores del sistema sino decisiones de ingeniería que requieren resolución manual fundamentada.',
    targetSubLabId: '09e-git-timeline',
  },
];

export const EvoCodeEngineeringLab: React.FC<EvoCodeEngineeringLabProps> = ({
  onClose,
}) => {
  const [activeSubLabId, setActiveSubLabId] = useState<string>('09a-logic');

  // 09A Logic State
  const [executionStep, setExecutionStep] = useState<number>(1);

  // 09B Debugger State
  const [isBugFixed, setIsBugFixed] = useState<boolean>(false);

  // 09C Algorithm State
  const [datasetSize, setDatasetSize] = useState<number>(1000);
  const [algoType, setAlgoType] = useState<'linear' | 'binary' | 'hash'>('linear');

  // 09D Data Flow State
  const [dataFilterActive, setDataFilterActive] = useState<boolean>(true);

  // 09E Git State
  const [gitCommits, setGitCommits] = useState<number>(4);

  // 09F Test Lab State
  const [testSuiteRun, setTestSuiteRun] = useState<boolean>(false);

  return (
    <EvoLabFramework
      tomeId="tomo-09"
      tomeNumber="09"
      tomeTitle="PROGRAMACIÓN DESDE CERO // INGENIERÍA DE SOFTWARE & LÓGICA"
      accentColor="#22c55e"
      subLabs={TOMO_09_SUBLABS}
      guidedCases={TOMO_09_GUIDED_CASES}
      activeSubLabId={activeSubLabId}
      onSelectSubLab={setActiveSubLabId}
      onClose={onClose}
      renderExperimentStation={({ activeSubLab, isDeepMode, onRecordMeasurement }) => {
        // LAB 09A // LOGIC VISUALIZER
        if (activeSubLab.id === '09a-logic') {
          const stepsData = [
            { line: 1, code: 'let total = 0;', stack: 'total: 0', desc: 'Inicialización de variable acumuladora en memoria local.' },
            { line: 2, code: 'const items = [10, 20, 30];', stack: 'total: 0, items: Array(3)', desc: 'Asignación de array de 3 elementos en el Heap.' },
            { line: 3, code: 'for (let i = 0; i < items.length; i++)', stack: `total: ${executionStep >= 4 ? (executionStep >= 6 ? 60 : 30) : 0}, i: ${executionStep - 3}`, desc: `Iteración en curso: procesando índice ${Math.max(0, executionStep - 3)}.` },
            { line: 4, code: '  total += items[i];', stack: `total: ${executionStep >= 6 ? 60 : executionStep >= 4 ? 30 : 10}`, desc: 'Suma acumulativa del valor actual a la variable total.' },
            { line: 5, code: 'return total;', stack: 'total: 60 (FINAL)', desc: 'Retorno del resultado consolidado (60).' },
          ];

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code Window with Current Line Pointer */}
                <div className="p-4 rounded-xl bg-black/90 border border-zinc-800 font-mono-tech space-y-2">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">
                    CÓDIGO FUENTE // EVALUADOR DE AST
                  </div>
                  <div className="space-y-1 text-xs">
                    {stepsData.map((st, idx) => (
                      <div
                        key={st.line}
                        className={`p-1.5 rounded flex items-center gap-2 ${
                          executionStep === idx + 1
                            ? 'bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-400 font-bold'
                            : 'text-zinc-400'
                        }`}
                      >
                        <span className="text-zinc-600 w-4 text-right">{st.line}</span>
                        <span>{st.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stack Memory Inspector */}
                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-3">
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">
                    ESTADO DE MEMORIA (STACK & HEAP)
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1.5">
                    <div className="text-zinc-500 text-[10px]">VARIABLES LOCALES:</div>
                    <div className="text-emerald-400 font-bold">{stepsData[Math.min(executionStep - 1, 4)].stack}</div>
                    <div className="text-zinc-500 text-[10px] pt-2">EXPLICACIÓN DE PASO:</div>
                    <div className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                      {stepsData[Math.min(executionStep - 1, 4)].desc}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={executionStep <= 1}
                      onClick={() => setExecutionStep(executionStep - 1)}
                      className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold disabled:opacity-30"
                    >
                      ← PASO ANTERIOR
                    </button>
                    <button
                      type="button"
                      disabled={executionStep >= 5}
                      onClick={() => setExecutionStep(executionStep + 1)}
                      className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold disabled:opacity-30"
                    >
                      SIGUIENTE PASO →
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: PASO {executionStep} DE 5 // RESULTADO: {executionStep === 5 ? '60 (CORRECTO)' : 'EN PROCESO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Paso de Ejecución (${executionStep})`,
                      baselineValue: 1,
                      experimentValue: executionStep,
                      deltaValue: executionStep - 1,
                      metricKey: 'execution_steps',
                      metricUnit: 'instrucciones',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Evaluador de máquina virtual ECMAScript 2026.',
                      samples: [executionStep, executionStep, executionStep],
                      interpretation: 'Inspección paso a paso del Stack Frame completada con 0 anomalías de memoria.',
                      verdict: 'MEJORA',
                      conclusion: 'Lógica algorítmica verificada deterministamente.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR EJECUCIÓN EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 09B // DEBUGGER LAB
        if (activeSubLab.id === '09b-debugger') {
          const bugCode = 'for (let i = 0; i <= items.length; i++) {\n  total += items[i]; // ⚠️ Off-by-one: items[3] = undefined -> NaN\n}';
          const fixedCode = 'for (let i = 0; i < items.length; i++) {\n  total += items[i]; // ✓ Correcto: índices 0, 1, 2\n}';

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">CÓDIGO A DEPURAR</div>
                  <pre className="p-3 rounded-lg bg-zinc-950 text-xs text-zinc-300 leading-relaxed overflow-x-auto">
                    {isBugFixed ? fixedCode : bugCode}
                  </pre>
                  <button
                    type="button"
                    onClick={() => setIsBugFixed(!isBugFixed)}
                    className={`w-full py-2 rounded font-bold transition-all ${
                      isBugFixed ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500 text-black'
                    }`}
                  >
                    {isBugFixed ? 'REVERTIR A CÓDIGO CON BUG' : 'APLICAR CORRECCIÓN PERICIAL (< length)'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2">
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">EXPECTED VS ACTUAL</div>
                  <div className="p-2.5 rounded bg-zinc-950">
                    <span className="text-zinc-500 text-[10px] block">VALOR ESPERADO (EXPECTED):</span>
                    <span className="text-emerald-400 font-bold text-sm">60 (Número entero)</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950">
                    <span className="text-zinc-500 text-[10px] block">VALOR OBTENIDO (ACTUAL):</span>
                    <span className={`font-bold text-sm ${isBugFixed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isBugFixed ? '60 (PASS)' : 'NaN (FAIL // TypeError)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {isBugFixed ? 'BUG OFF-BY-ONE RESUELTO' : 'ERROR DE ÍNDICE DETECTADO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Corrección de Bucle (${isBugFixed ? '< length' : '<= length'})`,
                      baselineValue: 0,
                      experimentValue: isBugFixed ? 100 : 0,
                      deltaValue: isBugFixed ? 100 : 0,
                      metricKey: 'bug_resolution_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Evaluación de aserciones IEEE 1008.',
                      samples: [isBugFixed ? 100 : 0],
                      interpretation: isBugFixed
                        ? 'La corrección a `< items.length` previene el acceso al índice fuera de rango, retornando 60 de forma determinista.'
                        : 'El operador `<=` genera un valor `undefined` que corrompe la sumatoria a `NaN`.',
                      verdict: isBugFixed ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Depuración pericial completada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR DEPURACIÓN EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 09C // ALGORITHM BENCH
        if (activeSubLab.id === '09c-algorithm-bench') {
          const opsLinear = datasetSize;
          const opsBinary = Math.ceil(Math.log2(datasetSize));
          const opsHash = 1;
          const currentOps = algoType === 'linear' ? opsLinear : algoType === 'binary' ? opsBinary : opsHash;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold">
                    <span>TAMAÑO DEL DATASET (N)</span>
                    <span className="text-amber-400">{datasetSize.toLocaleString()} elementos</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 100, 1000, 10000].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setDatasetSize(sz)}
                        className={`p-1.5 rounded font-bold ${
                          datasetSize === sz ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {sz >= 1000 ? `${sz / 1000}k` : sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">ALGORITMO DE BÚSQUEDA</div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setAlgoType('linear')}
                      className={`w-full p-2 rounded text-left ${
                        algoType === 'linear' ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Búsqueda Lineal $O(n)$ // Recorrido secuencial
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlgoType('binary')}
                      className={`w-full p-2 rounded text-left ${
                        algoType === 'binary' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Búsqueda Binaria $O(\\log n)$ // División a la mitad
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlgoType('hash')}
                      className={`w-full p-2 rounded text-left ${
                        algoType === 'hash' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Hash Map / Set $O(1)$ // Acceso directo instantáneo
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-3 gap-3 font-mono-tech text-center">
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">LINEAL O(n)</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">{opsLinear.toLocaleString()} ops</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">BINARIA O(log n)</div>
                  <div className="text-lg font-bold text-cyan-300 mt-0.5">{opsBinary} ops</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">HASH O(1)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{opsHash} op</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  OPERACIONES EJECUTADAS: {currentOps.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Complejidad Algorítmica (${algoType} para N=${datasetSize})`,
                      baselineValue: opsLinear,
                      experimentValue: currentOps,
                      deltaValue: currentOps - opsLinear,
                      metricKey: 'operation_count',
                      metricUnit: 'ops',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Contador determinista de ciclos Big-O.',
                      samples: [currentOps, currentOps, currentOps],
                      interpretation:
                        algoType !== 'linear'
                          ? `El algoritmo ${algoType} redujo las operaciones de ${opsLinear} a ${currentOps} (mejora de ${((1 - currentOps / opsLinear) * 100).toFixed(1)}%).`
                          : 'El algoritmo lineal escala proporcionalmente a N.',
                      verdict: algoType !== 'linear' ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion: 'Escalabilidad algorítmica demostrada metrológicamente.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR BENCHMARK BIG-O →
                </button>
              </div>
            </div>
          );
        }

        // LAB 09D // DATA FLOW
        if (activeSubLab.id === '09d-data-flow') {
          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">
                  CANALIZACIÓN DE FUNCIONES PURAS (FILTER → MAP → REDUCE)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                    <strong className="text-cyan-400">1. INPUT CRUDO</strong>
                    <div className="text-[11px] text-zinc-400">[12ms, 45ms, 180ms, 15ms]</div>
                  </div>
                  <div className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                    <strong className="text-amber-400">2. FILTER (&lt; 100ms)</strong>
                    <div className="text-[11px] text-zinc-400">[12ms, 45ms, 15ms] (Descarta outliers)</div>
                  </div>
                  <div className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                    <strong className="text-emerald-400">3. REDUCE (Promedio)</strong>
                    <div className="text-[11px] text-emerald-300 font-bold">24.0 ms (Resultado Puro)</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: PIPELINE INMUTABLE COMPLETADO (3 ÍTEMS PROCESADOS)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Pipeline de Datos Funcional Inmutable',
                      baselineValue: 4,
                      experimentValue: 3,
                      deltaValue: -1,
                      metricKey: 'pipeline_throughput',
                      metricUnit: 'ítems',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Transformación funcional pura sin mutación de estado.',
                      samples: [3, 3, 3],
                      interpretation: 'El pipeline descartó el valor atípico de 180ms sin mutar el array original en memoria.',
                      verdict: 'MEJORA',
                      conclusion: 'Transformación determinista inmutable comprobada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR PIPELINE EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 09E // GIT TIMELINE
        if (activeSubLab.id === '09e-git-timeline') {
          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">
                  GRAFO ACÍCLICO DIRIGIDO (DAG) // HISTORIAL DE COMMITS
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700 shrink-0">
                    <div className="text-zinc-500 text-[10px]">commit a1b2c3</div>
                    <div className="text-white font-bold">feat: init project</div>
                  </div>
                  <span className="text-zinc-600 font-bold">→</span>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700 shrink-0">
                    <div className="text-zinc-500 text-[10px]">commit d4e5f6</div>
                    <div className="text-white font-bold">feat: vrm sensor</div>
                  </div>
                  <span className="text-zinc-600 font-bold">→</span>
                  <div className="p-2.5 rounded bg-emerald-950 border border-emerald-500 shrink-0">
                    <div className="text-emerald-400 text-[10px]">HEAD -&gt; main (789abc)</div>
                    <div className="text-white font-bold">fix: off-by-one loop</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  RAMA ACTIVA: `main` // COMMITS TOTALES: {gitCommits}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Estructura de Grafo Git',
                      baselineValue: 3,
                      experimentValue: gitCommits,
                      deltaValue: 1,
                      metricKey: 'commit_count',
                      metricUnit: 'commits',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Modelo de objetos Git DAG inmutable.',
                      samples: [gitCommits],
                      interpretation: 'Commit atómico registrado con firma criptográfica y mensaje estandarizado.',
                      verdict: 'MEJORA',
                      conclusion: 'Control de versiones pericial verificado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR HISTORIAL GIT →
                </button>
              </div>
            </div>
          );
        }

        // LAB 09F // TEST LAB
        if (activeSubLab.id === '09f-test-lab') {
          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/90 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">
                  SUITE DE PRUEBAS UNITARIAS (VITEST / JEST SPEC)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-zinc-950 border-l-2 border-emerald-400 flex items-center justify-between">
                    <span>✓ test(&apos;calculates median frametime correctly&apos;)</span>
                    <span className="text-emerald-400 font-bold">PASS (1.2 ms)</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border-l-2 border-emerald-400 flex items-center justify-between">
                    <span>✓ test(&apos;handles empty array without throwing&apos;)</span>
                    <span className="text-emerald-400 font-bold">PASS (0.8 ms)</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border-l-2 border-emerald-400 flex items-center justify-between">
                    <span>✓ test(&apos;sanitizes IP strings against regex&apos;)</span>
                    <span className="text-emerald-400 font-bold">PASS (0.5 ms)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  RESULTADO SUITE: 3 PASSED // 0 FAILED // 100% COBERTURA
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Batería de Pruebas Unitarias',
                      baselineValue: 0,
                      experimentValue: 100,
                      deltaValue: 100,
                      metricKey: 'test_pass_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Runner de aserciones automatizadas Vitest.',
                      samples: [100, 100, 100],
                      interpretation: 'La suite de tests valida el cumplimiento de contratos en todos los casos límite.',
                      verdict: 'MEJORA',
                      conclusion: 'Evidencia de software determinista demostrada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR REPORTE DE TESTS →
                </button>
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
};

export default EvoCodeEngineeringLab;
