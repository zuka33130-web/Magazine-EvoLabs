import {
  BuildRequirements,
  BuildSessionData,
  BuildComponentItem,
  ComponentValueRating,
  CompatibilityReport,
  CompatibilityCheck,
  CompatibilityEngineProvider,
  SubsystemType,
} from '../types';

export class DeterministicCompatibilityEngine implements CompatibilityEngineProvider {
  /**
   * Deterministic compatibility verification across all selected subsystems
   */
  evaluateCompatibility(components: BuildSessionData['selectedComponents']): CompatibilityReport {
    const checks: CompatibilityCheck[] = [];
    const { motherboard, cpu, ram, gpu, storage, psu, cooling } = components;
    const caseItem = (components as any).case as BuildComponentItem | undefined;

    // 1. CPU <-> Motherboard Socket Match & BIOS Version
    if (motherboard && cpu) {
      const mbSocket = (motherboard.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || 'UNKNOWN';
      const cpuSocket = (cpu.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || 'UNKNOWN';

      if (mbSocket !== 'UNKNOWN' && cpuSocket !== 'UNKNOWN') {
        const isMatch = mbSocket.toUpperCase() === cpuSocket.toUpperCase();
        if (!isMatch) {
          checks.push({
            id: 'chk-socket',
            title: 'Compatibilidad de Socket (CPU ↔ Placa Base)',
            subsystems: ['cpu', 'motherboard'],
            status: 'INCOMPATIBLE',
            detail: `INCOMPATIBLE: El procesador requiere socket ${cpuSocket} pero la placa base posee ${mbSocket}. No calzarán físicamente.`,
          });
        } else {
          // Check BIOS generation update requirement
          const isRyzen9000 = /9800x3d|9950x|9900x|9700x|9600x/i.test(cpu.model);
          const isB650OrX670 = /b650|x670|a620/i.test(motherboard.model);
          const isIntel14th = /14900|14700|14600|14400/i.test(cpu.model);
          const isIntel600Series = /z690|b660|h610/i.test(motherboard.model);

          if (isRyzen9000 && isB650OrX670) {
            checks.push({
              id: 'chk-bios-support',
              title: 'Compatibilidad de BIOS / Microcódigo AGESA',
              subsystems: ['motherboard', 'cpu'],
              status: 'COMPATIBLE_AFTER_BIOS_UPDATE',
              detail: 'COMPATIBLE_AFTER_BIOS_UPDATE: La placa base soporta mecánicamente AM5, pero para inicializar procesadores Ryzen Serie 9000 (Zen 5) requiere versión de BIOS actualizada con AGESA 1.2.0.0 o superior (o utilizar botón BIOS Flashback sin CPU).',
            });
          } else if (isIntel14th && isIntel600Series) {
            checks.push({
              id: 'chk-bios-support',
              title: 'Compatibilidad de BIOS (Intel 14va Gen en Serie 600)',
              subsystems: ['motherboard', 'cpu'],
              status: 'COMPATIBLE_AFTER_BIOS_UPDATE',
              detail: 'COMPATIBLE_AFTER_BIOS_UPDATE: La placa base Serie 600 requiere actualización previa de BIOS para reconocer procesadores Intel Core de 14va generación.',
            });
          } else if (isIntel14th) {
            checks.push({
              id: 'chk-bios-support',
              title: 'Microcódigo de Estabilidad Intel 14va Gen',
              subsystems: ['motherboard', 'cpu'],
              status: 'WARNING',
              detail: 'ADVERTENCIA: Se recomienda verificar que la placa base tenga aplicada la BIOS con microcódigo 0x129/0x12B de Intel para prevenir voltajes elevados transitorios.',
            });
          } else {
            checks.push({
              id: 'chk-socket',
              title: 'Compatibilidad de Socket Físico',
              subsystems: ['cpu', 'motherboard'],
              status: 'COMPATIBLE',
              detail: `COMPATIBLE: Tanto la placa base como el procesador operan sobre el socket nativo ${mbSocket}.`,
            });
          }
        }
      } else {
        checks.push({
          id: 'chk-socket-unknown',
          title: 'Socket Físico de Procesador',
          subsystems: ['cpu', 'motherboard'],
          status: 'UNKNOWN',
          detail: 'No se dispone de la especificación explícita de socket para uno de los componentes.',
        });
      }
    }

    // 2. RAM <-> Motherboard Generation Match (DDR4 vs DDR5)
    if (motherboard && ram) {
      const mbIsDdr5 = motherboard.specsSummary.toUpperCase().includes('DDR5');
      const mbIsDdr4 = motherboard.specsSummary.toUpperCase().includes('DDR4');
      const ramIsDdr5 = ram.specsSummary.toUpperCase().includes('DDR5');
      const ramIsDdr4 = ram.specsSummary.toUpperCase().includes('DDR4');

      if ((mbIsDdr5 || mbIsDdr4) && (ramIsDdr5 || ramIsDdr4)) {
        const isDdrMatch = (mbIsDdr5 && ramIsDdr5) || (mbIsDdr4 && ramIsDdr4);
        checks.push({
          id: 'chk-ram-gen',
          title: 'Generación de Memoria RAM (DDR4 / DDR5)',
          subsystems: ['ram', 'motherboard'],
          status: isDdrMatch ? 'COMPATIBLE' : 'INCOMPATIBLE',
          detail: isDdrMatch
            ? `COMPATIBLE: Las ranuras de la placa base y los módulos de memoria coinciden en el estándar ${ramIsDdr5 ? 'DDR5' : 'DDR4'}.`
            : `INCOMPATIBLE: La placa base soporta ${mbIsDdr5 ? 'DDR5' : 'DDR4'} y has seleccionado módulos ${ramIsDdr5 ? 'DDR5' : 'DDR4'}. La muesca física difiere por norma JEDEC.`,
        });
      } else {
        checks.push({
          id: 'chk-ram-unknown',
          title: 'Tipo de Ranura de Memoria',
          subsystems: ['ram', 'motherboard'],
          status: 'UNKNOWN',
          detail: 'Falta información precisa del estándar DDR en la ficha técnica.',
        });
      }
    }

    // 3. Form Factor (Motherboard vs Case)
    if (motherboard && caseItem) {
      const isMbAtx = motherboard.specsSummary.includes('ATX') && !motherboard.specsSummary.includes('Micro-ATX');
      const isCaseMicroAtx = caseItem.specsSummary.includes('Micro-ATX') || caseItem.model.includes('MicroATX');
      const isCaseMiniItx = caseItem.specsSummary.includes('Mini-ITX');

      if (isMbAtx && (isCaseMicroAtx || isCaseMiniItx)) {
        checks.push({
          id: 'chk-ff-mb-case',
          title: 'Factor de Forma (Placa Base ↔ Gabinete)',
          subsystems: ['case', 'motherboard'],
          status: 'INCOMPATIBLE',
          detail: `INCOMPATIBLE: La placa base es formato ATX estándar y no cabe físicamente en el gabinete seleccionado (${isCaseMiniItx ? 'Mini-ITX' : 'Micro-ATX'}).`,
        });
      } else {
        checks.push({
          id: 'chk-ff-mb-case',
          title: 'Factor de Forma (Placa Base ↔ Gabinete)',
          subsystems: ['case', 'motherboard'],
          status: 'COMPATIBLE',
          detail: 'COMPATIBLE: Las dimensiones de la placa base y los puntos de anclaje coinciden con las especificaciones del gabinete.',
        });
      }
    }

    // 4. GPU Clearance (GPU Length vs Case)
    if (gpu && caseItem) {
      const gpuLengthMatch = gpu.specsSummary.match(/Largo\s*:\s*(\d+)\s*mm/i);
      const caseGpuClearanceMatch = caseItem.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i);

      if (gpuLengthMatch && caseGpuClearanceMatch) {
        const gpuLengthMm = parseInt(gpuLengthMatch[1], 10);
        const caseClearanceMm = parseInt(caseGpuClearanceMatch[1], 10);

        if (gpuLengthMm > caseClearanceMm) {
          checks.push({
            id: 'chk-gpu-clearance',
            title: 'Espacio Físico de GPU (Longitud vs Gabinete)',
            subsystems: ['gpu', 'case'],
            status: 'INCOMPATIBLE',
            detail: `INCOMPATIBLE: La placa de video mide ${gpuLengthMm}mm de largo pero el gabinete tiene un clearance máximo de ${caseClearanceMm}mm. Chocará con el frente o ventiladores.`,
          });
        } else {
          checks.push({
            id: 'chk-gpu-clearance',
            title: 'Espacio Físico de GPU (Longitud vs Gabinete)',
            subsystems: ['gpu', 'case'],
            status: 'COMPATIBLE',
            detail: `COMPATIBLE: La placa de video (${gpuLengthMm}mm) entra con holgura en el gabinete (${caseClearanceMm}mm de clearance máximo).`,
          });
        }
      }
    }

    // 5. Cooler Clearance (Cooler Height vs Case)
    if (cooling && caseItem) {
      const coolerHeightMatch = cooling.specsSummary.match(/Altura\s*:\s*(\d+)\s*mm/i);
      const caseCoolerClearanceMatch = caseItem.specsSummary.match(/Max\s*Cooler\s*CPU\s*:\s*(\d+)\s*mm/i);

      if (coolerHeightMatch && caseCoolerClearanceMatch) {
        const coolerHeightMm = parseInt(coolerHeightMatch[1], 10);
        const caseClearanceMm = parseInt(caseCoolerClearanceMatch[1], 10);

        if (coolerHeightMm > caseClearanceMm) {
          checks.push({
            id: 'chk-cooler-clearance',
            title: 'Altura de Disipador de CPU (Clearance Gabinete)',
            subsystems: ['cooling', 'case'],
            status: 'INCOMPATIBLE',
            detail: `INCOMPATIBLE: El disipador mide ${coolerHeightMm}mm de alto y excede el límite del gabinete (${caseClearanceMm}mm). No cerrará el panel lateral.`,
          });
        } else {
          checks.push({
            id: 'chk-cooler-clearance',
            title: 'Altura de Disipador de CPU (Clearance Gabinete)',
            subsystems: ['cooling', 'case'],
            status: 'COMPATIBLE',
            detail: `COMPATIBLE: El disipador (${coolerHeightMm}mm) cabe dentro del panel lateral (${caseClearanceMm}mm permitidos).`,
          });
        }
      }
    }

    // 6. Power Draw vs PSU Wattage
    let cpuTdpW = 65;
    let cpuTdpKnown = false;
    if (cpu) {
      const match = cpu.specsSummary.match(/(\d+)\s*W\s*TDP/i);
      if (match) {
        cpuTdpW = parseInt(match[1], 10);
        cpuTdpKnown = true;
      }
    }

    let gpuPowerW = 0;
    let gpuPowerKnown = false;
    if (gpu) {
      const match = gpu.specsSummary.match(/(\d+)\s*W/i);
      if (match) {
        gpuPowerW = parseInt(match[1], 10);
        gpuPowerKnown = true;
      }
    }

    const systemOverheadW = 75; // Placa base, RAM, NVMe, ventiladores
    const totalPowerDrawW = cpuTdpW + gpuPowerW + systemOverheadW;

    let psuWattageW = 0;
    let psuSufficient: boolean | 'UNKNOWN' = 'UNKNOWN';
    let psuMarginW = 0;

    if (psu) {
      const match = psu.specsSummary.match(/(\d+)\s*W/i);
      if (match) {
        psuWattageW = parseInt(match[1], 10);
        if (cpu && !cpuTdpKnown) {
          checks.push({
            id: 'chk-psu-unknown-cpu',
            title: 'Capacidad de Fuente de Poder (Consumo CPU Desconocido)',
            subsystems: ['psu', 'cpu'],
            status: 'UNKNOWN',
            detail: 'No se puede verificar la suficiencia eléctrica porque el procesador no especifica su TDP en watts.',
          });
        } else if (gpu && !gpuPowerKnown) {
          checks.push({
            id: 'chk-psu-unknown-gpu',
            title: 'Capacidad de Fuente de Poder (Consumo GPU Desconocido)',
            subsystems: ['psu', 'gpu'],
            status: 'UNKNOWN',
            detail: 'No se puede verificar la suficiencia eléctrica porque la placa de video no especifica su consumo en watts en el catálogo.',
          });
        } else {
          psuMarginW = psuWattageW - totalPowerDrawW;
          psuSufficient = psuMarginW >= 80; // Margen de seguridad para transitorios

          checks.push({
            id: 'chk-psu-capacity',
            title: 'Capacidad de Fuente de Poder (PSU vs Consumo Pico)',
            subsystems: ['psu', 'gpu'],
            status: psuSufficient ? 'COMPATIBLE' : psuMarginW >= 0 ? 'WARNING' : 'INCOMPATIBLE',
            detail: psuSufficient
              ? `COMPATIBLE: Consumo pico estimado en ~${totalPowerDrawW}W frente a una fuente de ${psuWattageW}W (margen seguro de ${psuMarginW}W para transitorios).`
              : psuMarginW >= 0
              ? `ADVERTENCIA: La fuente de ${psuWattageW}W cubre los ${totalPowerDrawW}W pico pero con muy poco margen de holgura (${psuMarginW}W).`
              : `INCOMPATIBLE: El consumo pico estimado (~${totalPowerDrawW}W) excede los ${psuWattageW}W de la fuente. Riesgo inminente de apagado por protección OCP/OPP.`,
          });
        }
      } else {
        checks.push({
          id: 'chk-psu-unknown-wattage',
          title: 'Potencia Nominal de Fuente de Poder',
          subsystems: ['psu', 'motherboard'],
          status: 'UNKNOWN',
          detail: 'La ficha técnica de la fuente no declara su potencia en watts.',
        });
      }
    }

    // 7. Power Connectors Verification
    if (psu && gpu) {
      const psuHas12VHpwr = psu.specsSummary.includes('12V-2x6') || psu.specsSummary.includes('12VHPWR') || psu.specsSummary.includes('PCIe 5.0') || psu.specsSummary.includes('ATX 3.0');
      const gpuRequiresHighPwr = gpuPowerKnown && gpuPowerW >= 250;
      if (gpuRequiresHighPwr && !psuHas12VHpwr) {
        checks.push({
          id: 'chk-pwr-connectors',
          title: 'Conectores de Alimentación PCIe / 12V-2x6',
          subsystems: ['psu', 'gpu'],
          status: 'WARNING',
          detail: 'ADVERTENCIA: La GPU consume ≥ 250W. Requiere verificar cantidad de cables PCIe independientes de 8 pines o adaptador 12V-2x6 en la fuente.',
        });
      } else if (!gpuRequiresHighPwr) {
        checks.push({
          id: 'chk-pwr-connectors',
          title: 'Conectores de Alimentación PCIe',
          subsystems: ['psu', 'gpu'],
          status: 'COMPATIBLE',
          detail: 'COMPATIBLE: El consumo de la GPU se satisface con conectores PCIe estándar o alimentación por ranura.',
        });
      }
    }

    // 8. Cooling Capacity vs CPU TDP
    let coolingSufficient: boolean | 'UNKNOWN' = 'UNKNOWN';
    if (cooling && cpu) {
      const matchCooler = cooling.specsSummary.match(/(\d+)\s*W/i);
      if (matchCooler && cpuTdpKnown) {
        const coolerCapW = parseInt(matchCooler[1], 10);
        coolingSufficient = coolerCapW >= cpuTdpW;

        checks.push({
          id: 'chk-cooling-tdp',
          title: 'Disipación Térmica (Cooler vs TDP de CPU)',
          subsystems: ['cooling', 'cpu'],
          status: coolingSufficient ? 'COMPATIBLE' : 'WARNING',
          detail: coolingSufficient
            ? `COMPATIBLE: Disipador apto. Soporta hasta ${coolerCapW}W frente a un procesador de ${cpuTdpW}W TDP.`
            : `ADVERTENCIA: El disipador (${coolerCapW}W) está muy justo para los ${cpuTdpW}W del procesador. Puede provocar thermal throttling bajo carga continua.`,
        });
      } else {
        checks.push({
          id: 'chk-cooling-unknown',
          title: 'Disipación Térmica',
          subsystems: ['cooling', 'cpu'],
          status: 'UNKNOWN',
          detail: 'Falta especificación explícita de TDP en watts del disipador o del procesador.',
        });
      }
    }

    // 9. Storage Interface Match
    if (storage && motherboard) {
      if (storage.specsSummary.includes('PCIe 5.0') && !motherboard.specsSummary.includes('PCIe 5.0 M.2') && !motherboard.specsSummary.includes('Gen5')) {
        checks.push({
          id: 'chk-storage-pcie-gen',
          title: 'Interfaz de Almacenamiento NVMe (PCIe Gen5 en Gen4)',
          subsystems: ['storage', 'motherboard'],
          status: 'WARNING',
          detail: 'ADVERTENCIA: El SSD NVMe opera en PCIe 5.0 pero la placa base solo dispone de ranuras M.2 PCIe 4.0. Operará a velocidades de Gen4 (retrocompatible).',
        });
      } else {
        checks.push({
          id: 'chk-storage-interface',
          title: 'Interfaz de Almacenamiento',
          subsystems: ['storage', 'motherboard'],
          status: 'COMPATIBLE',
          detail: 'COMPATIBLE: La unidad de almacenamiento es soportada por las ranuras M.2 o puertos SATA de la placa base.',
        });
      }
    }

    const hasIncompatible = checks.some((c) => c.status === 'INCOMPATIBLE');
    const hasBiosUpdate = checks.some((c) => c.status === 'COMPATIBLE_AFTER_BIOS_UPDATE');
    const overallStatus = hasIncompatible
      ? 'INCOMPATIBLE'
      : hasBiosUpdate
      ? 'COMPATIBLE_AFTER_BIOS_UPDATE'
      : 'COMPATIBLE';

    return {
      overallStatus,
      checks,
      totalPowerDrawW,
      psuMarginW,
      psuSufficient,
      coolingSufficient,
    };
  }

  /**
   * Impact Analysis Engine (Impact Assessment)
   * Evaluates how changing a component will affect already selected subsystems.
   */
  static assessImpact(
    incoming: BuildComponentItem,
    targetSubsystem: SubsystemType,
    current: BuildSessionData['selectedComponents']
  ): import('../types').ComponentImpactAssessment {
    const affected: import('../types').ComponentImpactAssessment['affectedSubsystems'] = [];

    const mb = current.motherboard;
    const cpu = current.cpu;
    const ram = current.ram;
    const gpu = current.gpu;
    const psu = current.psu;
    const cooling = current.cooling;
    const caseItem = (current as any).case as BuildComponentItem | undefined;

    if (targetSubsystem === 'motherboard') {
      const newMbSocket = (incoming.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const newMbIsDdr5 = incoming.specsSummary.includes('DDR5');
      const newMbIsDdr4 = incoming.specsSummary.includes('DDR4');
      const newMbIsAtx = incoming.specsSummary.includes('ATX') && !incoming.specsSummary.includes('Micro-ATX');

      if (cpu) {
        const cpuSocket = (cpu.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
        if (newMbSocket && cpuSocket && newMbSocket.toUpperCase() !== cpuSocket.toUpperCase()) {
          affected.push({
            subsystem: 'cpu',
            label: 'Procesador (CPU)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `El socket de la nueva placa (${newMbSocket}) no coincide con el CPU actual (${cpu.model} - ${cpuSocket}). Deberás reemplazar el procesador.`,
          });
        } else {
          affected.push({
            subsystem: 'cpu',
            label: 'Procesador (CPU)',
            severity: 'REQUIRES_REVALIDATION',
            impactDescription: `Revalidar compatibilidad de versión de BIOS y microcódigo con ${incoming.model}.`,
          });
        }
      }

      if (ram) {
        const ramIsDdr5 = ram.specsSummary.includes('DDR5');
        const ramIsDdr4 = ram.specsSummary.includes('DDR4');
        if ((newMbIsDdr5 && ramIsDdr4) || (newMbIsDdr4 && ramIsDdr5)) {
          affected.push({
            subsystem: 'ram',
            label: 'Memoria RAM',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `La nueva placa soporta ${newMbIsDdr5 ? 'DDR5' : 'DDR4'}, pero tienes seleccionada memoria ${ramIsDdr5 ? 'DDR5' : 'DDR4'}. Requiere cambio de módulos.`,
          });
        }
      }

      if (cooling && newMbSocket) {
        affected.push({
          subsystem: 'cooling',
          label: 'Disipador (Cooler)',
          severity: 'REQUIRES_REVALIDATION',
          impactDescription: `Verificar que el soporte o bracket de anclaje del cooler sea compatible con el socket ${newMbSocket}.`,
        });
      }

      if (caseItem && newMbIsAtx) {
        const isCaseMicroAtx = caseItem.specsSummary.includes('Micro-ATX');
        const isCaseMiniItx = caseItem.specsSummary.includes('Mini-ITX');
        if (isCaseMicroAtx || isCaseMiniItx) {
          affected.push({
            subsystem: 'case',
            label: 'Gabinete (Chasis)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `La nueva placa es formato ATX estándar y no entra en el gabinete compacto (${isCaseMiniItx ? 'Mini-ITX' : 'Micro-ATX'}).`,
          });
        }
      }
    }

    if (targetSubsystem === 'cpu') {
      const newCpuSocket = (incoming.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const newCpuTdp = parseInt((incoming.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '65', 10);

      if (mb) {
        const mbSocket = (mb.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
        if (newCpuSocket && mbSocket && newCpuSocket.toUpperCase() !== mbSocket.toUpperCase()) {
          affected.push({
            subsystem: 'motherboard',
            label: 'Placa Base (Motherboard)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `El nuevo procesador (${newCpuSocket}) es físicamente incompatible con el socket de la placa actual (${mbSocket}).`,
          });
        }
      }

      if (cooling) {
        const coolerCap = parseInt((cooling.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '120', 10);
        if (newCpuTdp > coolerCap) {
          affected.push({
            subsystem: 'cooling',
            label: 'Sistema de Refrigeración',
            severity: 'REQUIRES_REVALIDATION',
            impactDescription: `El nuevo CPU disipa ${newCpuTdp}W TDP, superando la capacidad recomendada del disipador actual (${coolerCap}W). Riesgo de throttling.`,
          });
        }
      }

      if (psu) {
        affected.push({
          subsystem: 'psu',
          label: 'Fuente de Poder (PSU)',
          severity: 'REQUIRES_REVALIDATION',
          impactDescription: `Rebalancear consumo pico del sistema con el TDP de ${newCpuTdp}W.`,
        });
      }
    }

    if (targetSubsystem === 'case') {
      const newGpuClearance = parseInt((incoming.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '350', 10);
      const newCoolerClearance = parseInt((incoming.specsSummary.match(/Max\s*Cooler\s*CPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '160', 10);
      const isCaseMicroAtx = incoming.specsSummary.includes('Micro-ATX');

      if (gpu) {
        const gpuLength = parseInt((gpu.specsSummary.match(/Largo\s*:\s*(\d+)\s*mm/i) || [])[1] || '280', 10);
        if (gpuLength > newGpuClearance) {
          affected.push({
            subsystem: 'gpu',
            label: 'Placa de Video (GPU)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `La placa de video actual (${gpuLength}mm) excede el espacio interno del nuevo gabinete (${newGpuClearance}mm).`,
          });
        }
      }

      if (cooling) {
        const coolerHeight = parseInt((cooling.specsSummary.match(/Altura\s*:\s*(\d+)\s*mm/i) || [])[1] || '155', 10);
        if (coolerHeight > newCoolerClearance) {
          affected.push({
            subsystem: 'cooling',
            label: 'Disipador (Cooler)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `El disipador actual (${coolerHeight}mm) excede la altura máxima del nuevo gabinete (${newCoolerClearance}mm). El panel no cerrará.`,
          });
        }
      }

      if (mb && isCaseMicroAtx && mb.specsSummary.includes('ATX') && !mb.specsSummary.includes('Micro-ATX')) {
        affected.push({
          subsystem: 'motherboard',
          label: 'Placa Base (Motherboard)',
          severity: 'BREAKING_INCOMPATIBLE',
          impactDescription: `La placa base actual es formato ATX y no entra en este nuevo gabinete Micro-ATX.`,
        });
      }
    }

    if (targetSubsystem === 'gpu') {
      const newGpuLength = parseInt((incoming.specsSummary.match(/Largo\s*:\s*(\d+)\s*mm/i) || [])[1] || '280', 10);
      const newGpuPower = parseInt((incoming.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '200', 10);

      if (caseItem) {
        const caseClearance = parseInt((caseItem.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '350', 10);
        if (newGpuLength > caseClearance) {
          affected.push({
            subsystem: 'case',
            label: 'Gabinete (Chasis)',
            severity: 'BREAKING_INCOMPATIBLE',
            impactDescription: `La nueva GPU (${newGpuLength}mm) excede la longitud máxima admitida por el gabinete (${caseClearance}mm).`,
          });
        }
      }

      if (psu) {
        const psuWatts = parseInt((psu.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '600', 10);
        if (newGpuPower + 150 > psuWatts) {
          affected.push({
            subsystem: 'psu',
            label: 'Fuente de Poder (PSU)',
            severity: 'REQUIRES_REVALIDATION',
            impactDescription: `La nueva GPU consume ~${newGpuPower}W. La fuente actual (${psuWatts}W) podría operar cerca de su límite con transitorios.`,
          });
        }
      }
    }

    const breakingCount = affected.filter((a) => a.severity === 'BREAKING_INCOMPATIBLE').length;
    const warningMessage =
      breakingCount > 0
        ? `¡Atención! Este cambio causará ${breakingCount} conflicto(s) insalvable(s) con componentes ya seleccionados.`
        : affected.length > 0
        ? `Este cambio afectará ${affected.length} subsistema(s) que deberán ser revalidados.`
        : 'Cambio limpio: no genera impactos adversos en el resto de la Machine.';

    return {
      incomingComponent: incoming,
      targetSubsystem,
      affectedSubsystems: affected,
      warningMessage,
    };
  }

  /**
   * Evaluates if a selected component provides real balanced value for the user's intended target
   */
  evaluateValueRating(
    component: BuildComponentItem,
    requirements: BuildRequirements,
    selectedSoFar: BuildSessionData['selectedComponents']
  ): ComponentValueRating {
    const { purpose, resolution, targetFps } = requirements;

    // GPU value analysis
    if (component.subsystem === 'gpu') {
      const matchVram = component.specsSummary.match(/(\d+)\s*GB/i);
      const vramGb = matchVram ? parseInt(matchVram[1], 10) : 0;
      const isIntegrada = component.model.includes('Integrada');

      if (purpose === 'OFFICE_STUDY_MULTITASK') {
        if (isIntegrada) return 'BALANCED';
        if (vramGb >= 16) return 'EXCESSIVE';
        return 'BALANCED';
      }

      if (purpose === 'GAMING_COMPETITIVE') {
        if (isIntegrada && targetFps >= 120) return 'INSUFFICIENT';
        if (resolution === '1080p' && vramGb > 16) return 'EXCESSIVE';
        return 'BALANCED';
      }

      if (resolution === '4K') {
        if (isIntegrada) return 'INSUFFICIENT';
        if (vramGb < 12) return 'INSUFFICIENT';
        return 'BALANCED';
      }
    }

    // CPU value analysis
    if (component.subsystem === 'cpu') {
      const matchCores = component.specsSummary.match(/(\d+)\s*Cores/i);
      const cores = matchCores ? parseInt(matchCores[1], 10) : 0;

      if (purpose === 'OFFICE_STUDY_MULTITASK') {
        if (cores >= 24) return 'EXCESSIVE';
        return 'BALANCED';
      }

      if (purpose === '3D_CAD_ENGINEERING' || purpose === 'CONTENT_CREATION_VIDEO') {
        if (cores <= 4) return 'INSUFFICIENT';
        if (cores >= 16) return 'NECESSARY';
        return 'BALANCED';
      }

      if (purpose === 'GAMING_COMPETITIVE') {
        return 'BALANCED';
      }
    }

    // RAM value analysis
    if (component.subsystem === 'ram') {
      const is64Gb = component.specsSummary.includes('64GB');
      const is16Gb = component.specsSummary.includes('16GB');

      if (purpose === 'OFFICE_STUDY_MULTITASK') {
        if (is64Gb) return 'EXCESSIVE';
        return 'BALANCED';
      }

      if ((purpose === 'CONTENT_CREATION_VIDEO' || purpose === '3D_CAD_ENGINEERING') && resolution === '4K') {
        if (is16Gb) return 'INSUFFICIENT';
        if (is64Gb) return 'NECESSARY';
        return 'BALANCED';
      }
    }

    return 'BALANCED';
  }
}
