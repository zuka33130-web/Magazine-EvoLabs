// TOMO 09: PROGRAMACIÓN DESDE CERO // LÓGICA COMPUTACIONAL, TYPESCRIPT, PYTHON & AUTOMATIZACIÓN
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo09Chapter {
  id: string;
  moduleNumber: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  readTime: string;
  topicsCovered: string[];
  capa1Explicacion: string;
  capa2DetalleTecnico: string;
  capa3PracticaMedicion: string;
  microformatos: {
    mito: string;
    errorComun: string;
    comprobalo: string;
    paraTecnicos: string;
    conclusionEvo: string;
  };
  decisionRule: string;
  codeSnippet: {
    language: 'typescript' | 'python';
    code: string;
    explanation: string;
  };
  miniDesafio: {
    prompt: string;
    solutionHint: string;
  };
}

export interface Tomo09CaseStudy {
  id: string;
  title: string;
  problemScenario: string;
  programmingApproach: string;
  codeImplemented: string;
  commonPitfallAvoided: string;
  realWorldImpact: string;
}

export interface Tomo09GlossaryItem {
  term: string;
  specification: string;
  definition: string;
  practicalTip: string;
}

export const TOMO_09_META = {
  number: '09',
  volumeLabel: 'Tomo 09',
  title: 'PROGRAMACIÓN DESDE CERO',
  subtitle: 'Empezá sin saber programar. Creá herramientas reales y pensá como programador.',
  themeColor: '#22C55E',
  secondaryColor: '#16A34A',
  badge: 'LÓGICA ALGORÍTMICA, TYPESCRIPT & AUTOMATIZACIÓN PYTHON',
  edition: 'Edición Técnica de Software 2026',
  totalPages: 52,
  manifestoPhrase: 'PROGRAMAR NO ES MEMORIZAR SINTAXIS: ES DESCOMPONER UN PROBLEMA COMPLEJO EN PASOS LÓGICOS SIMPLES, DETERMINISTAS Y AUDITABLES.',
  description: 'Tratado formativo y riguroso para aprender a programar desde la lógica computacional pura hasta el desarrollo de herramientas reales. Cubre variables, estructuras de control, funciones puras, tipado estático con TypeScript, scripting de automatización en Python, control de versiones con Git/GitHub, manipulación de JSON y consumo de APIs.',
  sources: [
    'ECMAScript 2024 (ECMA-262) Language Specification',
    'TypeScript Documentation & Handbook - Microsoft',
    'Python 3.12 Official Documentation (PEP 8 & Type Hints PEP 484)',
    'Pro Git (Second Edition) - Scott Chacon & Ben Straub',
    'Structure and Interpretation of Computer Programs (SICP) - Abelson & Sussman',
    'The Pragmatic Programmer - David Thomas & Andrew Hunt',
  ],
};

export const TOMO_09_CHAPTERS: Tomo09Chapter[] = [
  {
    id: 't09-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'Pensamiento Computacional: Algoritmos & Lógica',
    subtitle: 'Qué es programar, descomposición de problemas y la máquina de estados',
    readTime: '12 min',
    topicsCovered: ['01 Qué es programar', '02 Algoritmo', '03 Lógica', '25 Terminal'],
    capa1Explicacion:
      'Una computadora es la máquina más rápida del planeta, pero también la más tonta: no puede suponer nada, no tiene sentido común y hace exactamente lo que le ordenás, ni más ni menos. Programar es el arte de escribir una receta inequívoca (un algoritmo) compuesta de pasos elementales para que una máquina resuelva un problema en milisegundos.',
    capa2DetalleTecnico:
      'Un algoritmo formal debe ser: 1. Finito (termina tras un número determinista de pasos), 2. Preciso (cada instrucción no tiene ambigüedad sintáctica), 3. Definido (para las mismas entradas, siempre produce exactamente las mismas salidas). En la memoria física de la máquina, todo programa manipula el estado de registros y celdas de memoria RAM mediante instrucciones secuenciales, saltos condicionales y bifurcaciones.',
    capa3PracticaMedicion:
      'Abrir la terminal interactiva (REPL de Node.js o Python con `python` o `node`). Ejecutar operaciones aritméticas elementales, evaluar expresiones booleanas (`5 > 3`, `10 === 10`) y observar la respuesta inmediata del intérprete.',
    microformatos: {
      mito: 'Mito: "Para programar hay que ser un genio de las matemáticas avanzadas."',
      errorComun: 'Intentar escribir código directamente sin antes haber anotado en papel el flujo lógico paso a paso del problema.',
      comprobalo: 'Escribí la receta para atarte los cordones de las zapatillas sin saltearte ningún micro-movimiento: si la computadora fuera quien lo hace, se tropezaría a menos que cada instrucción sea atómica.',
      paraTecnicos: 'La complejidad temporal y espacial (Notación Big-O, ej. O(1) vs O(n)) cuantifica cómo escala el tiempo de cómputo a medida que el volumen de datos de entrada crece.',
      conclusionEvo: 'El código es solo el vehículo: la verdadera habilidad de un desarrollador es la claridad de su pensamiento lógico.',
    },
    decisionRule: 'Antes de tocar el teclado para programar una función, redactá en lenguaje humano (pseudocódigo) las precondiciones, el proceso y la salida esperada.',
    codeSnippet: {
      language: 'python',
      code: `# Algoritmo simple: Determinar si un número es par o impar
def es_par(numero: int) -> bool:
    # El operador módulo (%) obtiene el resto de la división por 2
    return (numero % 2) == 0

print(es_par(42))  # Devuelve True
print(es_par(17))  # Devuelve False`,
      explanation: 'La función recibe un entero, calcula el residuo matemático y devuelve un valor booleano determinista.',
    },
    miniDesafio: {
      prompt: 'Escribí una función que reciba dos temperaturas en grados Celsius y devuelva la mayor de las dos sin usar la función nativa `max()`.',
      solutionHint: 'Utilizá una condición `if / else` comparando `temp1 > temp2`.',
    },
  },
  {
    id: 't09-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Variables, Tipos de Datos & Estructuras de Control',
    subtitle: 'Almacenamiento en memoria, tipado estático vs dinámico, condiciones y bucles',
    readTime: '15 min',
    topicsCovered: ['04 Variables', '05 Tipos', '06 Operadores', '07 Condiciones', '08 Loops', '16 Strings'],
    capa1Explicacion:
      'Una variable es una caja etiquetada en la memoria RAM donde guardás un valor para usarlo más adelante (ej. el nombre de un usuario, el precio de un producto o la temperatura de la CPU). Cada dato tiene un tipo: texto (string), números (enteros o decimales) o valores de verdad/falsedad (booleanos). Las condiciones (`if / else`) le permiten al programa tomar decisiones en bifurcaciones, y los bucles (`for / while`) le permiten repetir una tarea miles de veces sin cansarse.',
    capa2DetalleTecnico:
      'En lenguajes dinámicos como Python estándar, los tipos se verifican en tiempo de ejecución. En TypeScript, el compilador verifica los tipos en tiempo de compilación (Static Type Checking), impidiendo errores catastróficos antes de que el código llegue a ejecutarse. El control de flujo utiliza instrucciones condicionales (`if`, `else if`, `switch`) y bucles acotados (`for i in range` / `for (let i = 0; i < N; i++)`) o bucles gobernados por condiciones centinela (`while`).',
    capa3PracticaMedicion:
      'Crear un script en TypeScript que itere sobre un array de valores de temperatura de CPU y filtre solo aquellas lecturas que superen el umbral crítico de 80 °C, imprimiendo una alerta formateada.',
    microformatos: {
      mito: 'Mito: "Las variables ocupan el mismo espacio en memoria sin importar su tipo."',
      errorComun: 'Crear bucles infinitos con `while True:` sin una condición de salida garantizada (break), congelando el proceso y saturando el núcleo de la CPU al 100%.',
      comprobalo: 'En JavaScript/TypeScript, intentá sumar `"5" + 5`: el resultado es `"55"` (concatenación de texto), mientras que `5 + 5` es `10`. La coerción de tipos implícita es una de las fuentes de bugs más comunes.',
      paraTecnicos: 'TypeScript compila a JavaScript plano eliminando todas las anotaciones de tipos (Type Erasure); los tipos existen únicamente para garantizar la corrección arquitectónica en desarrollo.',
      conclusionEvo: 'Declarar tipos explícitos transforma suposiciones frágiles en garantías matemáticas verificadas por el compilador.',
    },
    decisionRule: 'Usar siempre `const` por defecto en TypeScript; utilizar `let` únicamente cuando la reasignación de la variable sea estrictamente necesaria, y jamás usar `var`.',
    codeSnippet: {
      language: 'typescript',
      code: `// Tipado estático estricto en TypeScript
const umbralTemperaturaC: number = 80;
const lecturasSensores: number[] = [45, 62, 78, 83, 91, 55];

for (const temp of lecturasSensores) {
  if (temp >= umbralTemperaturaC) {
    console.warn(\`ALERTA TÉRMICA: \${temp}°C excede el límite de \${umbralTemperaturaC}°C\`);
  }
}`,
      explanation: 'El tipado `: number` y `: number[]` impide asignar cadenas de texto accidentales a las lecturas numéricas.',
    },
    miniDesafio: {
      prompt: 'Creá un bucle que sume todos los números del 1 al 100 y muestre el resultado final (5050).',
      solutionHint: 'Inicializá un acumulador `let total = 0` y sumá cada `i` en un ciclo `for`.',
    },
  },
  {
    id: 't09-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'Funciones, Ámbito (Scope) & Modularidad',
    subtitle: 'Parámetros, valores de retorno, funciones puras y reutilización limpia de código',
    readTime: '14 min',
    topicsCovered: ['09 Funciones', '10 Parámetros', '11 Retorno', '12 Scope', '21 Módulos', '31 Refactor'],
    capa1Explicacion:
      'Si tenés que copiar y pegar el mismo bloque de código tres veces en diferentes lugares, estás haciendo las cosas mal: el código duplicado es una trampa mortal de mantenimiento. Las funciones son mini-máquinas especializadas: reciben ingredientes (parámetros de entrada), hacen su trabajo y devuelven un resultado terminado (valor de retorno). Podés llamarlas cien veces desde cualquier parte del programa.',
    capa2DetalleTecnico:
      'Una Función Pura (concepto de programación funcional) no tiene efectos secundarios (Side Effects): para los mismos argumentos, siempre devuelve el mismo valor sin alterar variables globales ni estados externos. El Ámbito (Scope) define la visibilidad de las variables: las variables declaradas dentro de una función tienen ámbito local (Block Scope) y se destruyen en la pila de llamadas (Call Stack) al finalizar la función, impidiendo colisiones de nombres.',
    capa3PracticaMedicion:
      'Refactorizar un script monolítico de 100 líneas dividiéndolo en 3 funciones especializadas con exportación modular (`export function` en TypeScript o módulos `.py` en Python), importándolas limpiamente en otro archivo.',
    microformatos: {
      mito: 'Mito: "Cuanto más larga sea una función, más potente es el programa."',
      errorComun: 'Modificar variables globales dentro de una función sin avisar: esto introduce estados mutables impredecibles que dificultan la depuración.',
      comprobalo: 'Inspeccioná el Call Stack en el depurador: colocá un breakpoint dentro de una función anidada y observá cómo cada invocación apila un marco de ejecución independiente en la memoria.',
      paraTecnicos: 'Las clausuras léxicas (Closures) permiten que una función recuerde y acceda a las variables de su ámbito envolvente incluso después de que la función externa haya retornado.',
      conclusionEvo: 'Una función debe hacer una sola cosa y hacerla extraordinariamente bien (Principio de Responsabilidad Única).',
    },
    decisionRule: 'Si una función supera las 30 líneas de código o requiere la palabra "Y" para describir lo que hace, debe descomponerse en funciones más pequeñas.',
    codeSnippet: {
      language: 'typescript',
      code: `// Función pura: Conversión metrológica de temperatura
export function convertirCelsiusAFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

// Invocación modular limpia
const tempLocalC = 25;
const tempLocalF = convertirCelsiusAFahrenheit(tempLocalC);
console.log(\`\${tempLocalC}°C equivalen a \${tempLocalF}°F\`); // 77°F`,
      explanation: 'La función es determinista, no muta variables externas y es fácilmente testeable con pruebas unitarias.',
    },
    miniDesafio: {
      prompt: 'Diseñá una función pura que reciba el precio de un componente y el porcentaje de IVA (ej. 21) y retorne el precio final con impuesto incluido.',
      solutionHint: 'Retorná `precio * (1 + iva / 100)`.',
    },
  },
  {
    id: 't09-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Estructuras de Datos: Arrays, Objetos & JSON',
    subtitle: 'Listas, diccionarios clave-valor, serialización y esquemas de intercambio',
    readTime: '15 min',
    topicsCovered: ['13 Estructuras de datos', '14 Arrays', '15 Objetos', '23 APIs', '24 JSON'],
    capa1Explicacion:
      'En el mundo real no trabajamos con variables sueltas: trabajamos con conjuntos de datos estructurados (como una lista de piezas de hardware, o una ficha completa de un cliente con nombre, DNI, teléfono y saldo). Los Arrays (listas) agrupan elementos en orden numérico. Los Objetos (o diccionarios) agrupan pares de clave-valor (`propiedad: dato`). Y JSON es el lenguaje universal que usan todas las computadoras del mundo para intercambiar esta información por Internet.',
    capa2DetalleTecnico:
      'JSON (JavaScript Object Notation, RFC 8259) es un formato de texto plano estructurado que admite cadenas, números, booleanos, valores nulos, arrays y objetos anidados. La serialización (`JSON.stringify()` en JS / `json.dumps()` en Python) convierte una estructura de memoria en una cadena de texto para transmisión o guardado en disco; la deserialización (`JSON.parse()` / `json.loads()`) reconstruye la estructura en memoria.',
    capa3PracticaMedicion:
      'Crear un objeto TypeScript fuertemente tipado mediante una interfaz formal (`interface ComponenteHardware`), transformarlo a JSON, guardarlo en un archivo de texto `.json` y volver a leerlo validando que las propiedades coincidan con el contrato de tipos.',
    microformatos: {
      mito: 'Mito: "JSON y JavaScript son exactamente lo mismo."',
      errorComun: 'Intentar acceder a propiedades de un objeto nulo o indefinido (`TypeError: Cannot read properties of undefined`), la causa número uno de crashes en desarrollo web.',
      comprobalo: 'Utilizá el operador de encadenamiento opcional `hardware?.temperatura?.maxima`: si alguna propiedad intermedia no existe, devuelve `undefined` pacíficamente sin romper el programa.',
      paraTecnicos: 'La búsqueda por clave en un objeto/diccionario tiene complejidad O(1) promedio gracias a tablas de hash (Hash Maps), mientras que buscar un elemento en un array sin ordenar tiene complejidad O(n).',
      conclusionEvo: 'Modelar correctamente las estructuras de datos antes de programar resuelve el 80% de la complejidad del software.',
    },
    decisionRule: 'Definir siempre una interfaz (`interface`) o tipo (`type`) explícito para cualquier objeto que represente entidades del negocio o respuestas de APIs.',
    codeSnippet: {
      language: 'typescript',
      code: `// Contrato formal de tipos para un dispositivo
interface DispositivoRed {
  readonly ip: string;
  nombreHost: string;
  puertosAbiertos: number[];
  estaOnline: boolean;
}

const router: DispositivoRed = {
  ip: '192.168.1.1',
  nombreHost: 'Gateway-Principal',
  puertosAbiertos: [80, 443, 53],
  estaOnline: true,
};

// Serialización a formato estándar JSON
const payloadJson: string = JSON.stringify(router, null, 2);
console.log(payloadJson);`,
      explanation: 'El tipado garantiza que ningún desarrollador pueda omitir propiedades obligatorias ni asignar tipos incorrectos.',
    },
    miniDesafio: {
      prompt: 'Creá un array con tres objetos que representen discos SSD (con propiedades `marca`, `capacidadGB` y `temperaturaC`) y filtrá con `.filter()` solo los que tengan temperatura superior a 50 °C.',
      solutionHint: 'Utilizá `discos.filter(d => d.temperaturaC > 50)`.',
    },
  },
  {
    id: 't09-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Manejo de Errores, Excepciones & Debugging',
    subtitle: 'Bloques try/catch, trazabilidad de pila (Stack Trace) y depuración metódica',
    readTime: '13 min',
    topicsCovered: ['17 Errores', '18 Debugging', '20 Entrada/salida', '30 Lectura de código'],
    capa1Explicacion:
      'En informática, las cosas fallan: un cable de red se desenchufa, un archivo que debías abrir fue borrado por el usuario, o el servidor web al que te conectás se cayó. Un mal programa se congela o se cierra sin avisar. Un buen programa anticipa los fallos, los captura con elegancia (`try / catch`) y explica con precisión qué salió mal para que el problema pueda corregirse.',
    capa2DetalleTecnico:
      'Una Excepción representa un evento anómalo que interrumpe el flujo normal de instrucciones. El bloque `try` envuelve el código susceptible de fallar; el bloque `catch` intercepta el objeto de error (con propiedades `name`, `message` y `stack`); el bloque opcional `finally` garantiza la liberación de recursos (como cerrar descriptores de archivos abiertos o conexiones a bases de datos) sin importar si hubo error o no. La depuración metódica (Debugging) utiliza puntos de interrupción (Breakpoints) en el depurador para pausar la ejecución e inspeccionar variables en memoria paso a paso.',
    capa3PracticaMedicion:
      'Depuración en VS Code: abrir un archivo con un error lógico intencional, fijar un breakpoint con F9, iniciar depuración con F5, usar F10 (Step Over) para avanzar línea a línea y observar el panel "Variables" para descubrir en qué ciclo el dato toma un valor incorrecto.',
    microformatos: {
      mito: 'Mito: "Los programadores expertos escriben código que nunca tiene errores a la primera."',
      errorComun: 'Escribir bloques `catch (e) {}` vacíos ("Silent Swallowing"): ocultan los errores bajo la alfombra, haciendo que el programa falle silenciosamente y sea imposible de diagnosticar.',
      comprobalo: 'Forzá un error intentando parsear una cadena corrupta con `JSON.parse("{invalido}")` dentro de un bloque try/catch y observá el mensaje detallado de sintaxis que entrega el motor.',
      paraTecnicos: 'El Stack Trace revela la cadena de llamadas invertida: te dice exactamente en qué línea falló la función y qué otras funciones la habían invocado previamente.',
      conclusionEvo: 'No temas a los errores: aprendé a leer la traza de la pila con tranquilidad deductiva; el error te está diciendo exactamente dónde buscar.',
    },
    decisionRule: 'Cualquier operación que interactúe con el exterior (red, disco, APIs o parseo de texto) debe estar obligatoriamente envuelta en manejo defensivo de errores.',
    codeSnippet: {
      language: 'typescript',
      code: `// Manejo robusto de errores en lectura de datos
function parsearConfiguracionSegura(textoCrudo: string): Record<string, unknown> | null {
  try {
    const config = JSON.parse(textoCrudo);
    return config;
  } catch (error) {
    const err = error as Error;
    console.error(\`ERROR DE PARSEO: \${err.message}\`);
    // Retorno de fallback seguro en vez de colapsar la aplicación
    return null;
  }
}`,
      explanation: 'La función captura el error de sintaxis, registra el mensaje técnico y devuelve null sin voltear el proceso.',
    },
    miniDesafio: {
      prompt: 'Escribí una función que divida dos números `a / b` y lance un error explícito `throw new Error("División por cero no permitida")` si `b === 0`.',
      solutionHint: 'Comprobá `if (b === 0) throw new Error(...)`.',
    },
  },
  {
    id: 't09-c06',
    moduleNumber: 'M03',
    chapterNumber: '06',
    title: 'Control de Versiones Profesional: Git & GitHub',
    subtitle: 'Commits atómicos, ramas (branches), pull requests y resolución de conflictos',
    readTime: '15 min',
    topicsCovered: ['27 Git', '28 Commits', '29 Branches', '30 Lectura de código', '31 Refactor'],
    capa1Explicacion:
      '¿Alguna vez guardaste archivos como `trabajo_final.docx`, `trabajo_final_v2.docx`, `trabajo_final_ESTE_SI.docx`? Eso es un caos. Git es la máquina del tiempo de los programadores: registra cada cambio que hacés en el código, quién lo hizo, cuándo y por qué. Te permite volver a cualquier punto del pasado si algo se rompe, y permite que diez programadores trabajen sobre el mismo proyecto sin pisarse el trabajo entre sí.',
    capa2DetalleTecnico:
      'Git es un sistema de control de versiones distribuido. Modela los cambios como instantáneas criptográficas (Directed Acyclic Graph / DAG de objetos SHA-1/SHA-256). Flujo de trabajo canónico: Área de trabajo (Working Directory) → Área de preparación (`git add` / Staging) → Historial local (`git commit -m "mensaje"`). Las ramas (`git branch` / `git checkout -b feature`) permiten desarrollar funcionalidades de manera aislada antes de fusionarlas (`git merge`) en la rama principal (`main`). Los conflictos de fusión ocurren cuando dos ramas modifican las mismas líneas de un archivo y Git exige una resolución manual.',
    capa3PracticaMedicion:
      'Comandos esenciales en consola: `git init`, `git status`, `git add .`, `git commit -m "feat: agregar módulo de telemetría"`, `git log --oneline --graph`, y `git diff` para inspeccionar diferencias exactas línea por línea antes de confirmar el commit.',
    microformatos: {
      mito: 'Mito: "Git y GitHub son la misma cosa."',
      errorComun: 'Hacer un único commit gigante que contiene 50 archivos modificados con el mensaje "cambios": imposibilita identificar qué cambio rompió el sistema si hay que revertir.',
      comprobalo: 'Hacé un cambio en un archivo, ejecutá `git diff` y comprobá cómo Git te muestra con precisión quirúrgica en verde lo que agregaste y en rojo lo que borraste.',
      paraTecnicos: 'El estándar de "Conventional Commits" (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`) permite generar registros de cambios automatizados (Changelogs) y versionado semántico.',
      conclusionEvo: 'Commits pequeños, atómicos y con mensajes claros son el seguro de vida de cualquier proyecto de software.',
    },
    decisionRule: 'Cada commit debe representar una única unidad lógica de cambio que compile y funcione correctamente de manera autónoma.',
    codeSnippet: {
      language: 'python',
      code: `# Flujo estándar de consola Git
# 1. Verificar estado actual
# $ git status

# 2. Agregar cambios al área de preparación
# $ git add src/data/tomo09Data.ts

# 3. Crear commit atómico con mensaje explicativo
# $ git commit -m "feat: completar temario de Tomo 09 de programación"

# 4. Sincronizar con el repositorio remoto
# $ git push origin feature/tomo-09`,
      explanation: 'El flujo garantiza trazabilidad completa y reversibilidad instantánea de cada cambio de código.',
    },
    miniDesafio: {
      prompt: '¿Qué comando de Git usarías para descartar todos los cambios locales no confirmados en un archivo y devolverlo a su estado del último commit?',
      solutionHint: 'Utilizá `git restore <nombre_archivo>`.',
    },
  },
  {
    id: 't09-c07',
    moduleNumber: 'M04',
    chapterNumber: '07',
    title: 'Automatización Práctica, APIs & Arquitectura Simple',
    subtitle: 'Consumo de endpoints REST, scripts de sistema con Python y testing básico',
    readTime: '16 min',
    topicsCovered: ['19 Archivos', '22 Paquetes', '23 APIs', '26 Automatización', '32 Testing', '33 Seguridad', '34 Rendimiento', '35 Arquitectura'],
    capa1Explicacion:
      'El verdadero superpoder de un programador es la automatización: tomar una tarea aburrida que un humano tarda dos horas en hacer a mano (como revisar 50 computadoras o descargar informes de red) y escribir un script que la resuelva en cuatro segundos mientras tomás un café. Además, conectando tu programa a APIs (las interfaces que permiten a diferentes programas hablar entre sí), podés consultar el clima, enviar mensajes o auditar servidores en la nube.',
    capa2DetalleTecnico:
      'Una API REST utiliza verbos HTTP estándar (`GET` para consultar, `POST` para crear, `PUT` para actualizar, `DELETE` para borrar) con códigos de estado estructurados (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error). En Python, la biblioteca `requests` o `urllib` gestiona las llamadas HTTP; en TypeScript/Node.js se utiliza `fetch` nativo con `async/await`. Las Pruebas Unitarias (Testing con Jest o Pytest) verifican automáticamente que las funciones clave sigan devolviendo resultados correctos tras cada modificación.',
    capa3PracticaMedicion:
      'Escribir un script en Python que lea un directorio local, extraiga el tamaño y fecha de modificación de cada archivo, filtre los que tengan más de 30 días y genere un informe `.csv` con la lista de candidatos para archivado.',
    microformatos: {
      mito: 'Mito: "Las pruebas automatizadas (tests) son una pérdida de tiempo que retrasa el proyecto."',
      errorComun: 'Guardar claves secretas de APIs o contraseñas escritas directamente en el código fuente (Hardcoding): si el código se sube a GitHub, las credenciales quedan expuestas a todo el mundo en segundos.',
      comprobalo: 'Cargá variables sensibles desde un archivo `.env` mediante `process.env.API_KEY` y agregá `.env` a tu archivo `.gitignore` para que jamás sea rastreado por Git.',
      paraTecnicos: 'La arquitectura en capas desacopla: 1. Capa de presentación (UI/Consola), 2. Capa de lógica de negocio (Servicios), 3. Capa de acceso a datos (Repositorios/APIs), facilitando el testing aislado.',
      conclusionEvo: 'No automatices el desorden: primero entendé el proceso, estructurá la lógica y luego dejá que el código trabaje por vos.',
    },
    decisionRule: 'Toda clave de acceso, token o secreto de configuración debe almacenarse exclusivamente en variables de entorno, jamás en el repositorio de código.',
    codeSnippet: {
      language: 'python',
      code: `import os
import json
import urllib.request

# Consumo de API REST nativo en Python
def consultar_estado_servicio(url: str) -> dict:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'EvoAudit/1.0'})
        with urllib.request.urlopen(req, timeout=5) as respuesta:
            datos = json.loads(respuesta.read().decode('utf-8'))
            return {'status': respuesta.status, 'data': datos}
    except Exception as e:
        return {'status': 500, 'error': str(e)}

# Invocación segura
resultado = consultar_estado_servicio('https://api.github.com')
print(f"Estado de la API: {resultado['status']}")`,
      explanation: 'El script utiliza manejo defensivo de red con timeout explícito y decodificación controlada de JSON.',
    },
    miniDesafio: {
      prompt: 'Escribí un script en Python que use `os.listdir(".")` para contar cuántos archivos con extensión `.json` existen en el directorio actual.',
      solutionHint: 'Usá una comprensión de lista: `len([f for f in os.listdir(".") if f.endswith(".json")])`.',
    },
  },
];

export const TOMO_09_CASES: Tomo09CaseStudy[] = [
  {
    id: 'case-01',
    title: 'Caso 1: Automatización de inventario técnico de hardware en 50 PCs',
    problemScenario: 'Un técnico de soporte debía relevar manualmente el modelo de placa madre, procesador, memoria RAM libre y número de serie de 50 computadoras en una empresa, perdiendo 2 jornadas enteras de trabajo.',
    programmingApproach: 'Desarrollo de un script ligero en Python utilizando `platform` y `psutil` que empaqueta las especificaciones en un archivo JSON unificado.',
    codeImplemented: `import platform, psutil, json
info_pc = {
    "sistema": platform.system(),
    "nodo": platform.node(),
    "cpu": platform.processor(),
    "nucleos": psutil.cpu_count(logical=True),
    "ram_total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
    "disco_libre_gb": round(psutil.disk_usage('C:\\\\').free / (1024**3), 2)
}
with open(f"audit_{platform.node()}.json", "w") as f:
    json.dump(info_pc, f, indent=2)`,
    commonPitfallAvoided: 'Evitó instalar software pesado de terceros en cada máquina: el script se ejecutó desde un pendrive en 3 segundos por equipo.',
    realWorldImpact: 'El tiempo total de auditoría se redujo de 16 horas a menos de 25 minutos con 0 errores de transcripción humana.',
  },
  {
    id: 'case-02',
    title: 'Caso 2: Bug crítico por `TypeError: Cannot read properties of undefined` en dashboard',
    problemScenario: 'Un panel de monitoreo de servidores colapsaba en blanco cuando una de las máquinas de la lista tenía el sensor de temperatura desconectado o nulo en la API.',
    programmingApproach: 'Migración a tipado estricto con interfaces de TypeScript y uso de Optional Chaining (`?.`) con Nullish Coalescing (`??`).',
    codeImplemented: `interface SensorTelemetria {
  id: string;
  temperaturaC?: number | null;
}
function obtenerTemperaturaSegura(sensor: SensorTelemetria): string {
  // Manejo defensivo: si temperaturaC es null o undefined, devuelve 'N/D'
  const temp = sensor?.temperaturaC ?? null;
  return temp !== null ? \`\${temp.toFixed(1)}°C\` : 'N/D';
}`,
    commonPitfallAvoided: 'Asumir que todas las propiedades de un payload JSON externo siempre vendrán pobladas y con valores válidos.',
    realWorldImpact: 'El dashboard pasó a ser 100% tolerante a fallos de sensores individuales sin colapsar la interfaz de usuario.',
  },
  {
    id: 'case-03',
    title: 'Caso 3: Conflicto de fusión (Merge Conflict) destructivo resuelto en Git',
    problemScenario: 'Dos desarrolladores editaron la misma función de cálculo de impuestos en ramas separadas. Al intentar hacer `git merge`, Git detuvo la operación indicando conflicto en 15 líneas.',
    programmingApproach: 'Inspección metódica de los delimitadores `<<<<<<< HEAD`, `=======` y `>>>>>>> feature`, aislando la lógica correcta de cada autor.',
    codeImplemented: `<<<<<<< HEAD
const tasaIvaAplicada = 0.21;
=======
const tasaIvaAplicada = obtenerTasaIvaPorRegion(regionCliente);
>>>>>>> feature/soporte-regional
// RESOLUCIÓN ATÓMICA FINAL:
const tasaIvaAplicada = regionCliente ? obtenerTasaIvaPorRegion(regionCliente) : 0.21;`,
    commonPitfallAvoided: 'Borrar los marcadores de conflicto a ciegas sin entender qué cambio introducía cada colega.',
    realWorldImpact: 'Se integró el soporte regional sin perder la lógica de fallback original y con historial de commits 100% limpio.',
  },
];

export const TOMO_09_GLOSSARY: Tomo09GlossaryItem[] = [
  {
    term: 'Algoritmo',
    specification: 'Ciencia de la Computación',
    definition: 'Conjunto ordenado, finito y no ambiguo de instrucciones que resuelven un problema o realizan un cálculo específico.',
    practicalTip: 'Un buen algoritmo minimiza el consumo de memoria y el número de operaciones necesarias.',
  },
  {
    term: 'Tipado Estático (Static Typing)',
    specification: 'TypeScript / C++ / Rust',
    definition: 'Mecanismo en el que los tipos de las variables se comprueban en tiempo de compilación antes de ejecutar el programa.',
    practicalTip: 'Previene más del 60% de los errores lógicos comunes al impedir operaciones entre tipos incompatibles.',
  },
  {
    term: 'Función Pura (Pure Function)',
    specification: 'Programación Funcional',
    definition: 'Función que para los mismos argumentos siempre produce exactamente el mismo resultado y no produce efectos secundarios.',
    practicalTip: 'Son ideales para pruebas automatizadas (tests) porque no dependen de bases de datos ni estados globales externos.',
  },
  {
    term: 'JSON (JavaScript Object Notation)',
    specification: 'RFC 8259',
    definition: 'Formato estándar de texto plano para serializar y transmitir estructuras de datos complejas entre aplicaciones.',
    practicalTip: 'No admite funciones, comentarios ni comillas simples: las claves y cadenas deben ir obligatoriamente entre comillas dobles.',
  },
  {
    term: 'Commit Atómico',
    specification: 'Git Architecture',
    definition: 'Un registro de confirmación en el historial de versiones que contiene un único cambio lógico completo y funcional.',
    practicalTip: 'Si un commit introduce un fallo, un commit atómico permite revertirlo con `git revert` sin romper otras partes del sistema.',
  },
];
