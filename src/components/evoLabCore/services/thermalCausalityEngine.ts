// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — THERMAL CAUSALITY & DEGRADATION ENGINE
// Principle: "NO ANALIZAR SÓLO QUÉ FALLÓ, SINO POR QUÉ TERMINÓ FALLANDO.
//              ESTUDIAR LA MACHINE COMO SISTEMA. CAUSA RAÍZ VS FACTORES VS CONSECUENCIA."
// ============================================================================

import {
  Machine,
  ThermalCausalReport,
  ThermalCausalNode,
  ThermalCertaintyLevel,
  GuidedThermalQuestion,
  DirectedThermalTest,
  BuildComponentItem,
} from '../types';

export interface PreBuildThermalRisk {
  isRisky: boolean;
  severity: 'CRITICAL_RISK' | 'HIGH_RISK' | 'MODERATE_WARNING' | 'BALANCED_SAFE';
  title: string;
  summary: string;
  coolingHeadroomW: number;
  airflowIndex: number; // 0-100
  bottlenecks: string[];
  recommendations: string[];
}

export class ThermalCausalityEngine {
  /**
   * Evaluates the thermal design, history, and causal failure tree of a Machine
   */
  static analyzeMachineThermalCausality(
    machine: Machine,
    answers: Record<string, string> = {},
    completedTests: Record<string, any> = {}
  ): ThermalCausalReport {
    const cpuTdpW = machine.cpu?.tdpW || 65;
    const coolerCapW = machine.cooling?.tdpCapacityW || 120;
    const gpuPowerW = machine.gpu?.powerW || 150;
    const isDedicatedGpu = machine.gpu?.isDedicated ?? false;
    const caseModel = machine.chassis?.model?.toLowerCase() || '';
    const fanCount = machine.fans?.count || 1;

    // Airflow restriction evaluation
    const isCaseRestrictive =
      caseModel.includes('h510') ||
      caseModel.includes('ciego') ||
      caseModel.includes('solid') ||
      caseModel.includes('quiet') ||
      caseModel.includes('genérico') ||
      caseModel.includes('silence');

    const coolingHeadroomW = coolerCapW - cpuTdpW;

    // 1. Identify Root Cause Hypothesis
    let primaryRootCause: ThermalCausalNode;
    if (coolingHeadroomW < 0) {
      primaryRootCause = {
        id: 'rc-cooler-deficit',
        kind: 'ROOT_CAUSE',
        subsystem: 'cooling',
        title: 'Sistema de Refrigeración Subdimensionado (Déficit Térmico Físico)',
        description: `El disipador instalado (${coolerCapW}W de capacidad nominal) es incapaz de evacuar los ${cpuTdpW}W de TDP sostenido del procesador bajo cargas completas.`,
        certainty: 'HIGHLY_PROBABLE',
        evidence: [
          `Capacidad de disipador: ${coolerCapW}W frente a consumo pico de CPU: ${cpuTdpW}W.`,
          `Margen térmico negativo: ${coolingHeadroomW}W de déficit.`,
        ],
      };
    } else if (coolingHeadroomW < 30) {
      primaryRootCause = {
        id: 'rc-cooler-marginal',
        kind: 'ROOT_CAUSE',
        subsystem: 'cooling',
        title: 'Margen de Disipación Críticamente Ajustado',
        description: `El cooler opera al límite térmico (${coolerCapW}W vs ${cpuTdpW}W). Cualquier incremento de temperatura ambiente o suciedad satura el bloque disipador.`,
        certainty: 'PROBABLE',
        evidence: [
          `Margen térmico de apenas ${coolingHeadroomW}W.`,
          `Falta de tolerancia para transitorios de potencia (PL2 / boost prolongado).`,
        ],
      };
    } else if (isCaseRestrictive && fanCount <= 1) {
      primaryRootCause = {
        id: 'rc-airflow-choke',
        kind: 'ROOT_CAUSE',
        subsystem: 'case',
        title: 'Asfixia de Flujo de Aire en Gabinete (Airflow Deficient)',
        description: 'El chasis no suministra renovación volumétrica de aire fresco. La energía térmica disipada por la GPU y CPU recircula internamente.',
        certainty: 'HIGHLY_PROBABLE',
        evidence: [
          `Gabinete restrictivo con panel frontal ciego.`,
          `Únicamente ${fanCount} ventilador instalado para un calor total de ~${cpuTdpW + gpuPowerW}W.`,
        ],
      };
    } else {
      primaryRootCause = {
        id: 'rc-normal-wear',
        kind: 'ROOT_CAUSE',
        subsystem: 'cooling',
        title: 'Degradación de Interfaz Térmica o Mantenimiento Físico',
        description: 'La capacidad teórica del hardware es balanceada; la causa más probable converge hacia pasta térmica resecada, pérdida de tensión de anclaje o polvo.',
        certainty: 'POSSIBLE',
        evidence: [
          `Dimensionamiento teórico en equilibrio (+${coolingHeadroomW}W de margen).`,
          `Requiere corroborar estado físico de la pasta térmica y aletas de radiador.`,
        ],
      };
    }

    // 2. Identify Contributing Factors
    const contributingFactors: ThermalCausalNode[] = [];

    if (fanCount <= 1) {
      contributingFactors.push({
        id: 'cf-fans-insufficient',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'fans',
        title: 'Caudal de Ventilación Insuficiente (Presión Negativa / Estancamiento)',
        description: `Solo cuenta con ${fanCount} ventilador en el chasis. La tasa de intercambio térmico (CFM) es incapaz de evacuar los watts acumulados.`,
        certainty: 'HIGHLY_PROBABLE',
        evidence: [`${fanCount} ventilador para disipar ${cpuTdpW + (isDedicatedGpu ? gpuPowerW : 0)}W de potencia térmica.`],
      });
    }

    if (isDedicatedGpu && gpuPowerW >= 220) {
      contributingFactors.push({
        id: 'cf-gpu-heat-dump',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'gpu',
        title: 'Transferencia de Calor Radiante de GPU a CPU',
        description: `La placa de video disipa ${gpuPowerW}W dentro del volumen del gabinete, elevando la temperatura de aire interno que aspira el disipador del procesador.`,
        certainty: 'PROBABLE',
        evidence: [`GPU de alto consumo (${gpuPowerW}W TDP) compartiendo la misma cámara de aire.`],
      });
    }

    if (isCaseRestrictive) {
      contributingFactors.push({
        id: 'cf-case-restriction',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'case',
        title: 'Panel Frontal Restrictivo / Admisión Obstruida',
        description: 'El diseño del gabinete carece de malla mesh permeable, forzando a los ventiladores a trabajar contra resistencia estática elevada.',
        certainty: 'HIGHLY_PROBABLE',
        evidence: [`Modelo de chasis identificado con admisión lateral angosta o panel cerrado.`],
      });
    }

    // Process Guided Inquiry Answers
    if (answers['dust_buildup'] === 'heavy') {
      contributingFactors.push({
        id: 'cf-dust-blanket',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'cooling',
        title: 'Manta Aislante de Polvo en Disipador y Filtros',
        description: 'La acumulación de polvo actúa como aislante térmico en las aletas de aluminio, reduciendo el coeficiente de convección en más del 40%.',
        certainty: 'CONFIRMED',
        evidence: ['Confirmado por inspección técnica del operador.'],
      });
    }

    if (answers['thermal_paste_age'] === 'over_2_years') {
      contributingFactors.push({
        id: 'cf-paste-pumpout',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'cooling',
        title: 'Degradación de Pasta Térmica (Pump-out y Resecamiento)',
        description: 'El compuesto térmico ha superado su vida útil recomendada. La pérdida de solventes genera micro-burbujas de aire de alta resistencia térmica.',
        certainty: 'HIGHLY_PROBABLE',
        evidence: ['Más de 2 años sin renovación de compuesto térmico.'],
      });
    }

    if (answers['cabinet_placement'] === 'enclosed_furniture') {
      contributingFactors.push({
        id: 'cf-enclosed-desk',
        kind: 'CONTRIBUTING_FACTOR',
        subsystem: 'case',
        title: 'Ubicación en Mueble Cerrado (Bucle de Recirculación Térmica)',
        description: 'El chasis toma aire caliente que él mismo expulsó por la parte posterior, elevando la temperatura ambiente local a más de 38°C.',
        certainty: 'CONFIRMED',
        evidence: ['Ubicación física confirmada en cavidad cerrada sin ventilación trasera.'],
      });
    }

    // 3. Identify Consequences
    const consequences: ThermalCausalNode[] = [
      {
        id: 'cq-thermal-throttling',
        kind: 'CONSEQUENCE',
        subsystem: 'cpu',
        title: 'Thermal Throttling Frecuente (PROCHOT a 95°C-100°C)',
        description: 'El microprocesador se ve forzado a reducir su multiplicador de reloj y voltaje VID para evitar el apagado catastrófico.',
        certainty: coolingHeadroomW <= 0 ? 'HIGHLY_PROBABLE' : 'PROBABLE',
        evidence: ['Comportamiento térmico deducido de la relación potencia/disipación.'],
      },
      {
        id: 'cq-fan-saturation',
        kind: 'CONSEQUENCE',
        subsystem: 'fans',
        title: 'Saturación Acústica de Ventiladores al 100% PWM',
        description: 'Los ventiladores operan continuamente a velocidad máxima, provocando desgaste acelerado de los rodamientos y ruido excesivo.',
        certainty: 'PROBABLE',
        evidence: ['Curva de BIOS forzada a 100% por superar umbral crítico de 80°C.'],
      },
      {
        id: 'cq-vrm-thermal-stress',
        kind: 'CONSEQUENCE',
        subsystem: 'motherboard',
        title: 'Estrés Térmico en Fases de Poder (VRM)',
        description: 'Las etapas de potencia MOSFET del motherboard reciben aire caliente del disipador de CPU, operando a más de 95°C y degradando los capacitores sólidos.',
        certainty: 'POSSIBLE',
        evidence: ['Ausencia de flujo de aire fresco directo sobre los disipadores de VRM.'],
      },
      {
        id: 'cq-unexpected-shutdowns',
        kind: 'CONSEQUENCE',
        subsystem: 'kernel',
        title: 'Apagados de Emergencia por Disparo Térmico (Thermal Trip)',
        description: 'Al superar los 105°C en el silicio, el hardware corta la señal POWER_OK para evitar la destrucción física del encapsulado.',
        certainty: coolingHeadroomW < -20 ? 'HIGHLY_PROBABLE' : 'POSSIBLE',
        evidence: ['Déficit térmico severo que supera la capacidad de compensación del throttling.'],
      },
    ];

    // Causal Chain
    const causalChain = [
      {
        step: 1,
        stage: 'DISEÑO TÉRMICO SUBDIMENSIONADO',
        description: primaryRootCause.description,
        nodeKind: 'ROOT_CAUSE' as const,
      },
      {
        step: 2,
        stage: 'FACTORES AGRAVANTES EN CASO REAL',
        description: contributingFactors.length > 0 ? contributingFactors.map((c) => c.title).join(' • ') : 'Factores ambientales normales.',
        nodeKind: 'CONTRIBUTING_FACTOR' as const,
      },
      {
        step: 3,
        stage: 'TEMPERATURA SOSTENIDA ELEVADA',
        description: 'El calor acumulado supera la tasa de disipación convectiva. El silicio opera continuamente sobre los 85°C-95°C.',
        nodeKind: 'CONSEQUENCE' as const,
      },
      {
        step: 4,
        stage: 'SATURACIÓN DE VENTILADORES',
        description: 'Curvas de ventilación al 100% sin margen para enfriar el bloque disipador.',
        nodeKind: 'CONSEQUENCE' as const,
      },
      {
        step: 5,
        stage: 'THERMAL THROTTLING & CAÍDA DE RELOJ',
        description: 'Pérdida perceptible de FPS, tartamudeo (stuttering) y tiempos de render prolongados.',
        nodeKind: 'CONSEQUENCE' as const,
      },
      {
        step: 6,
        stage: 'ESTRÉS ACUMULADO & FALLA ACTUAL',
        description: 'Degradación térmica de pasta, soldaduras BGA o disparo de protección PROCHOT/Thermal Trip.',
        nodeKind: 'CONSEQUENCE' as const,
      },
    ];

    // Guided Inspection Questions Definition
    const guidedInquiry: GuidedThermalQuestion[] = [
      {
        id: 'inq_instability_time',
        question: '¿La inestabilidad o caída de rendimiento aparece después de 10 a 20 minutos de uso intenso?',
        options: [
          { label: 'Sí, al principio funciona bien y luego empieza a fallar / apagar', value: 'yes_after_time', causalWeight: { factorId: 'rc-cooler-deficit', certaintyDelta: 20, note: 'Confirma saturación térmica progresiva del bloque de cobre/aluminio.' } },
          { label: 'No, falla instantáneamente al abrir el juego o encender', value: 'instant', causalWeight: { factorId: 'rc-cooler-deficit', certaintyDelta: -10, note: 'Orienta hacia falla eléctrica de PSU o cortocircuito más que térmica.' } },
          { label: 'Ocurre de forma completamente aleatoria en reposo', value: 'idle_random', causalWeight: { factorId: 'rc-cooler-deficit', certaintyDelta: -15, note: 'Orienta hacia software, drivers o memoria RAM inestable.' } },
        ],
        selectedAnswer: answers['inq_instability_time'],
      },
      {
        id: 'inq_fan_saturation',
        question: '¿Los ventiladores trabajan permanentemente a máxima velocidad (ruido constante de turbina)?',
        options: [
          { label: 'Sí, se ponen al 100% de inmediato y nunca bajan', value: 'always_100', causalWeight: { factorId: 'cq-fan-saturation', certaintyDelta: 25, note: 'Saturación confirmada de curva de refrigeración.' } },
          { label: 'Suben y bajan de velocidad con normalidad', value: 'normal_curve', causalWeight: { factorId: 'cq-fan-saturation', certaintyDelta: -10, note: 'Curva PWM responde adecuadamente.' } },
          { label: 'Giran muy despacio o casi no se escuchan', value: 'too_slow', causalWeight: { factorId: 'rc-cooler-deficit', certaintyDelta: 15, note: 'Posible falla en lectura de sensor o curva mal configurada en BIOS.' } },
        ],
        selectedAnswer: answers['inq_fan_saturation'],
      },
      {
        id: 'dust_buildup',
        question: '¿Existe acumulación visible de polvo en los filtros frontales o aletas del cooler?',
        options: [
          { label: 'Sí, capa visible y espesa de polvo o pelusas', value: 'heavy', causalWeight: { factorId: 'cf-dust-blanket', certaintyDelta: 30, note: 'Aislamiento térmico por suciedad comprobado.' } },
          { label: 'Leve polvillo superficial', value: 'light', causalWeight: { factorId: 'cf-dust-blanket', certaintyDelta: 5, note: 'Impacto marginal.' } },
          { label: 'Completamente limpio / recién soplado', value: 'clean', causalWeight: { factorId: 'cf-dust-blanket', certaintyDelta: -20, note: 'Descarta suciedad como factor contribuyente.' } },
        ],
        selectedAnswer: answers['dust_buildup'],
      },
      {
        id: 'thermal_paste_age',
        question: '¿Hace cuánto tiempo que no se renueva la pasta térmica del procesador?',
        options: [
          { label: 'Más de 2 años (o nunca se cambió desde fábrica)', value: 'over_2_years', causalWeight: { factorId: 'cf-paste-pumpout', certaintyDelta: 25, note: 'Degradación por envejecimiento de polímeros térmicos.' } },
          { label: 'Entre 6 meses y 1 año', value: '1_year', causalWeight: { factorId: 'cf-paste-pumpout', certaintyDelta: 5, note: 'Vida útil promedio aceptable.' } },
          { label: 'Menos de 3 meses / pasta nueva de calidad', value: 'fresh', causalWeight: { factorId: 'cf-paste-pumpout', certaintyDelta: -25, note: 'Descarta pasta térmica degradada.' } },
        ],
        selectedAnswer: answers['thermal_paste_age'],
      },
      {
        id: 'case_panel_type',
        question: '¿Qué tipo de panel frontal posee el gabinete?',
        options: [
          { label: 'Panel ciego de plástico / vidrio cerrado con rejillas laterales angostas', value: 'closed_glass', causalWeight: { factorId: 'cf-case-restriction', certaintyDelta: 25, note: 'Restricción física severa de flujo.' } },
          { label: 'Malla metálica perforada (Mesh) abierta', value: 'mesh_front', causalWeight: { factorId: 'cf-case-restriction', certaintyDelta: -25, note: 'Excelente entrada de aire fresco.' } },
          { label: 'Gabinete abierto / banco de pruebas abierto', value: 'open_bench', causalWeight: { factorId: 'cf-case-restriction', certaintyDelta: -30, note: 'Sin resistencia de flujo de chasis.' } },
        ],
        selectedAnswer: answers['case_panel_type'],
      },
      {
        id: 'cabinet_placement',
        question: '¿Dónde está ubicada físicamente la computadora?',
        options: [
          { label: 'Dentro de un mueble / hueco de escritorio cerrado por los costados y atrás', value: 'enclosed_furniture', causalWeight: { factorId: 'cf-enclosed-desk', certaintyDelta: 30, note: 'Recirculación de aire viciado comprobada.' } },
          { label: 'Sobre el escritorio o suelo con al menos 15-20cm de espacio libre alrededor', value: 'open_space', causalWeight: { factorId: 'cf-enclosed-desk', certaintyDelta: -20, note: 'Buena renovación de aire ambiente.' } },
          { label: 'Cerca de un radiador de calefacción o ventana al sol', value: 'near_heat_source', causalWeight: { factorId: 'cf-enclosed-desk', certaintyDelta: 20, note: 'Temperatura ambiente elevada inducida.' } },
        ],
        selectedAnswer: answers['cabinet_placement'],
      },
      {
        id: 'temp_recovery_speed',
        question: 'Al cerrar el juego o carga pesada, ¿la temperatura desciende de inmediato a ~45°C?',
        options: [
          { label: 'Sí, baja rápidamente en 10-15 segundos', value: 'fast_recovery', causalWeight: { factorId: 'rc-airflow-choke', certaintyDelta: -15, note: 'Indica buen contacto con disipador, limitación de airflow de caja.' } },
          { label: 'No, permanece caliente durante varios minutos (calor atrapado)', value: 'slow_heat_soak', causalWeight: { factorId: 'rc-airflow-choke', certaintyDelta: 25, note: 'Heat-soaking evidente por falta de ventiladores de extracción.' } },
        ],
        selectedAnswer: answers['temp_recovery_speed'],
      },
    ];

    // Directed Tests Definition
    const directedTests: DirectedThermalTest[] = [
      {
        id: 'test_cpu_sustained_stress',
        title: 'Prueba de Carga Térmica Sostenida de CPU (Rampa a 100% TDP)',
        targetSubsystem: 'cooling',
        durationSeconds: 180,
        instructions: 'Aplica carga de cálculo con instrucciones vectoriales AVX durante 3 minutos y monitorea la pendiente de temperatura y velocidad de fans.',
        expectedMetric: 'T_delta < 45°C sobre ambiente; reloj nominal sostenido sin PROCHOT.',
        observedResult: completedTests['test_cpu_sustained_stress'],
        hypothesisImpact: {
          targetNodeId: 'rc-cooler-deficit',
          newCertainty: 'CONFIRMED',
          verdict: 'Si la CPU supera los 95°C y hace throttling en menos de 90 segundos, se confirma cooler subdimensionado.',
        },
        status: completedTests['test_cpu_sustained_stress'] ? 'COMPLETED' : 'PENDING',
      },
      {
        id: 'test_airflow_delta_panel',
        title: 'Prueba de Diagnóstico Diferencial de Gabinete (Panel Lateral Abierto vs Cerrado)',
        targetSubsystem: 'case',
        durationSeconds: 120,
        instructions: 'Compara la temperatura máxima de CPU y GPU bajo carga con el panel lateral puesto frente al panel retirado.',
        expectedMetric: 'Diferencia ≤ 4°C entre cerrado y abierto.',
        observedResult: completedTests['test_airflow_delta_panel'],
        hypothesisImpact: {
          targetNodeId: 'cf-case-restriction',
          newCertainty: 'CONFIRMED',
          verdict: 'Si al retirar el panel la temperatura desciende más de 10°C, se confirma que el gabinete estrangula la ventilación.',
        },
        status: completedTests['test_airflow_delta_panel'] ? 'COMPLETED' : 'PENDING',
      },
      {
        id: 'test_fan_saturation_curve',
        title: 'Prueba de Respuesta y Saturación Acústica de Ventiladores',
        targetSubsystem: 'fans',
        durationSeconds: 60,
        instructions: 'Evalúa la correlación entre el ciclo de trabajo PWM de la placa base y las RPM reales leídas por el tacómetro.',
        expectedMetric: 'Ventiladores alcanzan RPM nominales sin roces ni saturación prematura.',
        observedResult: completedTests['test_fan_saturation_curve'],
        hypothesisImpact: {
          targetNodeId: 'cq-fan-saturation',
          newCertainty: 'CONFIRMED',
          verdict: 'Verifica si la curva de ventilación está agotando el régimen útil de los ventiladores.',
        },
        status: completedTests['test_fan_saturation_curve'] ? 'COMPLETED' : 'PENDING',
      },
    ];

    // Compute Overall Certainty
    let overallCertainty: ThermalCertaintyLevel = primaryRootCause.certainty;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount >= 4 && primaryRootCause.certainty === 'HIGHLY_PROBABLE') {
      overallCertainty = 'CONFIRMED';
    }

    // Prevention Roadmap ("¿CÓMO EVITAMOS QUE VUELVA A PASAR?")
    const preventionRoadmap = [
      {
        action: coolingHeadroomW < 20 ? 'Actualizar a disipador de doble torre (Dual Tower) o AIO 240/360mm' : 'Reemplazar pasta térmica por compuesto cerámico de 12.5 W/m-K',
        priority: 'CRITICAL' as const,
        expectedDeltaC: coolingHeadroomW < 20 ? '-14°C a -20°C bajo carga plena' : '-6°C a -10°C',
        estimatedCostUsd: coolingHeadroomW < 20 ? 45 : 8,
        rationale: 'Restaura el margen térmico positivo del silicio sobre el disipador.',
      },
      {
        action: fanCount < 3 ? 'Instalar 2 ventiladores frontales PWM de 120mm para presión positiva' : 'Invertir ventilador trasero a orientación de extracción directa',
        priority: 'HIGH' as const,
        expectedDeltaC: '-7°C a -12°C en temperatura interna de caja',
        estimatedCostUsd: fanCount < 3 ? 18 : 0,
        rationale: 'Garantiza ingreso continuo de aire fresco desde el frente y expulsión del calor de la GPU.',
      },
      {
        action: 'Reubicar el gabinete con 20cm de separación respecto a paredes o muebles cerrados',
        priority: 'RECOMMENDED' as const,
        expectedDeltaC: '-4°C a -6°C en temperatura de admisión',
        estimatedCostUsd: 0,
        rationale: 'Evita la recirculación de aire caliente viciado de escape.',
      },
      {
        action: 'Ajustar curva de ventilación en BIOS: 50% PWM hasta 65°C y rampa a 100% solo por encima de 85°C',
        priority: 'RECOMMENDED' as const,
        expectedDeltaC: 'Mitiga fatiga mecánica de ventiladores y ruido innecesario',
        estimatedCostUsd: 0,
        rationale: 'Reduce la saturación auditiva sin comprometer la seguridad térmica del encapsulado.',
      },
    ];

    // Machine Health Model
    let thermalHealthScore = 85;
    if (coolingHeadroomW < -20) thermalHealthScore = 30;
    else if (coolingHeadroomW < 0) thermalHealthScore = 50;
    else if (coolingHeadroomW < 25) thermalHealthScore = 68;

    if (isCaseRestrictive && fanCount <= 1) thermalHealthScore -= 15;

    const currentHealthScore = Math.max(20, Math.min(100, thermalHealthScore + 5));
    const powerHealthScore = Math.max(30, Math.min(100, (machine.psu?.wattageW || 650) >= (cpuTdpW + gpuPowerW + 150) ? 90 : 60));

    return {
      machineId: machine.id,
      overallVerdict: `Causa Primaria: ${primaryRootCause.title}`,
      overallCertainty,
      primaryRootCause,
      contributingFactors,
      consequences,
      causalChain,
      historicalTelemetryStatus: 'NOT_AVAILABLE_RECONSTRUCTED',
      reconstructionBasis: [
        `TDP nominal CPU (${cpuTdpW}W) vs Capacidad Cooler (${coolerCapW}W).`,
        `Carga térmica de GPU (${gpuPowerW}W) y factor de forma de gabinete.`,
        `Conteo de ventiladores de chasis (${fanCount}) y patrón de flujo.`,
      ],
      guidedInquiry,
      directedTests,
      preventionRoadmap,
      healthModel: {
        currentHealthScore,
        thermalHealthScore: Math.max(20, Math.min(100, thermalHealthScore)),
        powerHealthScore,
        coolingHeadroomW,
        upgradeHeadroom: coolingHeadroomW > 40 && fanCount >= 3 ? 'HIGH' : coolingHeadroomW > 10 ? 'MODERATE' : 'RESTRICTED',
        workloadSuitability: thermalHealthScore >= 70 ? 'OPTIMAL' : thermalHealthScore >= 50 ? 'ACCEPTABLE' : 'THERMALLY_CHOKED',
        longTermRisk: thermalHealthScore < 45 ? 'CRITICAL_DEGRADATION' : thermalHealthScore < 65 ? 'ELEVATED' : 'BALANCED_STABLE',
        riskAnalysisNote:
          thermalHealthScore < 60
            ? 'Riesgo elevado de envejecimiento prematuro de soldaduras BGA y fatiga térmica en VRM debido a operación continuada al límite de disipación.'
            : 'Configuración térmicamente controlada con margen seguro para cargas de trabajo continuas.',
      },
    };
  }

  /**
   * Pre-build Design Thermal Risk Analysis (Used in Universal PC Builder BEFORE buying)
   */
  static assessPreBuildThermalRisk(components: {
    cpu?: BuildComponentItem;
    cooling?: BuildComponentItem;
    case?: BuildComponentItem;
    fans?: BuildComponentItem;
    gpu?: BuildComponentItem;
  }): PreBuildThermalRisk {
    const { cpu, cooling, case: caseItem, fans, gpu } = components;

    const cpuTdpW = parseInt((cpu?.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '65', 10);
    const coolerCapW = parseInt((cooling?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '95', 10);
    const gpuPowerW = parseInt((gpu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '160', 10);
    const caseModel = caseItem?.model?.toLowerCase() || '';

    const isRestrictiveCase =
      caseModel.includes('h510') ||
      caseModel.includes('ciego') ||
      caseModel.includes('solid') ||
      caseModel.includes('genérico');

    const coolingHeadroomW = coolerCapW - cpuTdpW;
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];

    let isRisky = false;
    let severity: PreBuildThermalRisk['severity'] = 'BALANCED_SAFE';

    if (coolingHeadroomW < 0) {
      isRisky = true;
      severity = 'CRITICAL_RISK';
      bottlenecks.push(`Cooler subdimensionado (${coolerCapW}W < ${cpuTdpW}W de CPU).`);
      recommendations.push(`Elegir un disipador de mayor capacidad (mínimo ${cpuTdpW + 35}W TDP).`);
    } else if (coolingHeadroomW < 25 && cpuTdpW >= 105) {
      isRisky = true;
      severity = 'HIGH_RISK';
      bottlenecks.push(`Margen térmico muy estrecho (+${coolingHeadroomW}W) para un procesador de alto consumo.`);
      recommendations.push('Recomendado disipador de doble torre o líquida 240mm para evitar throttling.');
    }

    if (isRestrictiveCase && gpuPowerW >= 220) {
      isRisky = true;
      if (severity !== 'CRITICAL_RISK') severity = 'HIGH_RISK';
      bottlenecks.push(`Gabinete con flujo restringido alojando una GPU de ${gpuPowerW}W.`);
      recommendations.push('Seleccionar un gabinete con frontal Mesh para permitir entrada de aire frío.');
    }

    if (!fans && gpuPowerW >= 200) {
      bottlenecks.push('No se han especificado ventiladores de chasis adicionales.');
      recommendations.push('Incorporar al menos 2 ventiladores frontales y 1 trasero.');
    }

    let airflowIndex = 75;
    if (isRestrictiveCase) airflowIndex -= 30;
    if (coolingHeadroomW < 0) airflowIndex -= 25;
    if (gpuPowerW >= 250) airflowIndex -= 10;
    airflowIndex = Math.max(15, Math.min(100, airflowIndex));

    return {
      isRisky,
      severity,
      title:
        severity === 'CRITICAL_RISK'
          ? 'RIESGO TÉRMICO CRÍTICO DETECTADO EN EL DISEÑO'
          : severity === 'HIGH_RISK'
          ? 'ADVERTENCIA: MARGEN TÉRMICO CRÍTICAMENTE AJUSTADO'
          : 'DISEÑO TÉRMICO EN EQUILIBRIO',
      summary:
        severity === 'CRITICAL_RISK'
          ? `La configuración es eléctricamente compatible, pero el disipador (${coolerCapW}W) no podrá sostener al procesador (${cpuTdpW}W). Provocará thermal throttling y posibles apagados.`
          : severity === 'HIGH_RISK'
          ? `El sistema funcionará, pero con poco margen de disipación ante cargas prolongadas de gaming o render.`
          : 'Capacidades de disipación y flujo de aire acordes a los componentes seleccionados.',
      coolingHeadroomW,
      airflowIndex,
      bottlenecks,
      recommendations,
    };
  }
}
