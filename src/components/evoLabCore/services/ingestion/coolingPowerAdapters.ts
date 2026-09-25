// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — COOLING & POWER OFFICIAL SOURCE ADAPTERS
// Brands: NOCTUA, DEEPCOOL, SEASONIC
// Rigor: Exact socket mounting, Cooler height mm, Radiator sizes, ATX 3.0/3.1 specs
// ============================================================================

import { SubsystemType } from '../../types';
import {
  HardwareOfficialSourceAdapter,
  MasterComponentRecord,
  IngestionBatchResult,
  SourceAdapterStats,
} from './types';

// ============================================================================
// 1. NOCTUA OFFICIAL SOURCE ADAPTER
// ============================================================================
export class NoctuaSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'noctua-at-official';
  readonly manufacturer = 'Noctua';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['noctua.at', 'ncc.noctua.at'];
  readonly supportedCategories: SubsystemType[] = ['cooling', 'fans'];

  private records: MasterComponentRecord[] = [
    // COOLER: NOCTUA NH-D15 G2 (Next-Gen Flagship Dual-Tower)
    {
      id: 'noctua-nh-d15-g2',
      category: 'cooling',
      manufacturer: 'Noctua',
      family: 'NH-D15 Series',
      model: 'Noctua NH-D15 G2 Dual-Tower CPU Cooler',
      exactModel: 'NH-D15 G2',
      partNumber: 'NH-D15-G2',
      sku: 'NH-D15-G2',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-07-02',
      specsSummary: 'Dual-Tower 8-Heatpipe • Altura 168 mm • 2x Ventiladores NF-A14x25r G2 PWM • SecuFirm2+ (Torx T20) • Compatible AM5, AM4, LGA1851, LGA1700 • NSPR 198 (TDP equiv. 280W+)',
      specifications: {
        coolerType: 'Air Dual-Tower',
        heightWithFansMm: 168,
        widthMm: 150,
        depthWithFansMm: 152,
        weightWithFansG: 1525,
        heatpipesCount: 8,
        fanCount: 2,
        fanModels: '2x Noctua NF-A14x25r G2 PWM (1500 RPM)',
        socketCompatibility: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200', 'LGA1151', 'LGA1150', 'LGA1155'],
        ramClearanceMm: 32, // 59mm in single fan mode or with front fan raised
        noctuaStandardisedPerformanceRating: 198,
        tdpCapacityW: 280,
      },
      fieldEvidence: {
        heightMm: { value: 168, sourceUrl: 'https://noctua.at/en/nh-d15-g2/specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-07-10', confidence: 100 },
        sockets: { value: 'AM5, AM4, LGA1851, LGA1700', sourceUrl: 'https://noctua.at/en/nh-d15-g2/specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-07-10', confidence: 100 },
      },
      officialSources: [
        { title: 'Noctua NH-D15 G2 Official Specifications', url: 'https://noctua.at/en/nh-d15-g2/specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-07-10' },
      ],
      lastVerifiedAt: '2024-07-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 149,
    },

    // COOLER: NOCTUA NH-U12A CHROMAX.BLACK
    {
      id: 'noctua-nh-u12a-chromax-black',
      category: 'cooling',
      manufacturer: 'Noctua',
      family: 'NH-U12A Series',
      model: 'Noctua NH-U12A chromax.black Premium CPU Cooler',
      exactModel: 'NH-U12A chromax.black',
      partNumber: 'NH-U12A-CH-BK',
      sku: 'NH-U12A-CH-BK',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2021-10-12',
      specsSummary: 'Single-Tower 7-Heatpipe • Altura 158 mm • 100% RAM Compatibility en LGA1700/AM5 • 2x NF-A12x25 PWM chromax.black • NSPR 169 (TDP equiv. 240W)',
      specifications: {
        coolerType: 'Air Single-Tower Push-Pull',
        heightWithFansMm: 158,
        widthMm: 125,
        depthWithFansMm: 112,
        weightWithFansG: 1220,
        heatpipesCount: 7,
        fanCount: 2,
        fanModels: '2x Noctua NF-A12x25 PWM chromax.black (2000 RPM)',
        socketCompatibility: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200', 'LGA1151'],
        ramClearanceMm: '100% (Asymmetric design avoids RAM slots)',
        noctuaStandardisedPerformanceRating: 169,
        tdpCapacityW: 240,
      },
      fieldEvidence: {
        heightMm: { value: 158, sourceUrl: 'https://noctua.at/en/nh-u12a-chromax-black/specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-10', confidence: 100 },
      },
      officialSources: [
        { title: 'Noctua NH-U12A chromax.black Specs', url: 'https://noctua.at/en/nh-u12a-chromax-black/specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-10' },
      ],
      lastVerifiedAt: '2024-01-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 129,
    },
  ];

  async fetchCatalog(category: SubsystemType): Promise<IngestionBatchResult> {
    const filtered = this.records.filter((r) => r.category === category);
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      category,
      totalFound: filtered.length,
      modelsImported: filtered,
      duplicatesDetected: 0,
      unknownFieldsCount: 0,
      failedItems: [],
      lastVerifiedAt: new Date().toISOString(),
    };
  }

  async fetchComponentDetails(modelOrSku: string, category: SubsystemType): Promise<MasterComponentRecord | null> {
    const clean = modelOrSku.toLowerCase().trim();
    return this.records.find((r) => r.category === category && (r.model.toLowerCase().includes(clean) || (r.partNumber && r.partNumber.toLowerCase().includes(clean)))) || null;
  }

  getStats(): SourceAdapterStats {
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      executionMode: this.executionMode,
      officialDomains: this.officialDomains,
      categoriesSupported: this.supportedCategories,
      totalRecords: this.records.length,
      activeModels: this.records.length,
      legacyModels: 0,
      discontinuedModels: 0,
      recordsWithEvidence: this.records.length,
      unknownFieldsTotal: 0,
      lastIngestionAt: '2024-07-10T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}

// ============================================================================
// 2. DEEPCOOL OFFICIAL SOURCE ADAPTER
// ============================================================================
export class DeepCoolSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'deepcool-official-specs';
  readonly manufacturer = 'DeepCool';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['deepcool.com', 'global.deepcool.com'];
  readonly supportedCategories: SubsystemType[] = ['cooling', 'case', 'psu'];

  private records: MasterComponentRecord[] = [
    // COOLER: DEEPCOOL AK620 DIGITAL (Dual-Tower with Real-Time Display)
    {
      id: 'deepcool-ak620-digital-r-ak620-bkadmn-g',
      category: 'cooling',
      manufacturer: 'DeepCool',
      family: 'AK Series',
      model: 'DeepCool AK620 Digital Dual-Tower CPU Cooler with Status Screen',
      exactModel: 'R-AK620-BKADMN-G',
      partNumber: 'R-AK620-BKADMN-G',
      sku: 'R-AK620-BKADMN-G',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2023-06-15',
      specsSummary: 'Dual-Tower 6-Heatpipe • Altura 162 mm • Pantalla digital integrada para temperatura y uso de CPU • 2x Fans FDB 120mm • Compatible AM5, AM4, LGA1851, LGA1700 • TDP 260W',
      specifications: {
        coolerType: 'Air Dual-Tower with Digital Screen',
        heightWithFansMm: 162,
        widthMm: 129,
        depthWithFansMm: 138,
        weightWithFansG: 1486,
        heatpipesCount: 6,
        fanCount: 2,
        fanModels: '2x DeepCool FK120 FDB (500-1850 RPM, 68.99 CFM)',
        socketCompatibility: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200', 'LGA1151'],
        ramClearanceMm: 43,
        displayConnector: 'USB 2.0 9-pin Header',
        tdpCapacityW: 260,
      },
      fieldEvidence: {
        heightMm: { value: 162, sourceUrl: 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-Digital-Status-Display-CPU-Cooler-1700-AM5/2023/17202.shtml', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
        tdp: { value: '260W', sourceUrl: 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-Digital-Status-Display-CPU-Cooler-1700-AM5/2023/17202.shtml', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'DeepCool AK620 Digital Specs', url: 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-Digital-Status-Display-CPU-Cooler-1700-AM5/2023/17202.shtml', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 79,
    },

    // COOLER: DEEPCOOL LT720 360MM AIO LIQUID COOLER
    {
      id: 'deepcool-lt720-r-lt720-bkamnf-g-1',
      category: 'cooling',
      manufacturer: 'DeepCool',
      family: 'LT Series Liquid Coolers',
      model: 'DeepCool LT720 360mm High-Performance Liquid CPU Cooler',
      exactModel: 'R-LT720-BKAMNF-G-1',
      partNumber: 'R-LT720-BKAMNF-G-1',
      sku: 'R-LT720-BKAMNF-G-1',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-20',
      specsSummary: 'AIO Líquida 360mm • Radiador 402 x 120 x 27 mm • Bomba 4ta Gen 3100 RPM • 3x Fans FK120 • Compatible AM5, AM4, LGA1851, LGA1700 • Capacidad térmica 300W+ TDP',
      specifications: {
        coolerType: 'AIO Liquid 360mm',
        radiatorDimensionsMm: '402 x 120 x 27',
        radiatorMaterial: 'Aluminum',
        tubeLengthMm: 410,
        pumpSpeedRpm: 3100,
        fanCount: 3,
        fanModels: '3x DeepCool FK120 (500-2250 RPM, 85.85 CFM)',
        socketCompatibility: ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200', 'LGA1151', 'sTRX4', 'sTR4'],
        tdpCapacityW: 300,
      },
      fieldEvidence: {
        radiatorSize: { value: '360mm (402x120x27mm)', sourceUrl: 'https://www.deepcool.com/products/Cooling/liquidcoolers/LT720-360mm-Liquid-CPU-Cooler-1700-AM5/2022/16286.shtml', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'DeepCool LT720 Official Specs', url: 'https://www.deepcool.com/products/Cooling/liquidcoolers/LT720-360mm-Liquid-CPU-Cooler-1700-AM5/2022/16286.shtml', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 129,
    },
  ];

  async fetchCatalog(category: SubsystemType): Promise<IngestionBatchResult> {
    const filtered = this.records.filter((r) => r.category === category);
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      category,
      totalFound: filtered.length,
      modelsImported: filtered,
      duplicatesDetected: 0,
      unknownFieldsCount: 0,
      failedItems: [],
      lastVerifiedAt: new Date().toISOString(),
    };
  }

  async fetchComponentDetails(modelOrSku: string, category: SubsystemType): Promise<MasterComponentRecord | null> {
    const clean = modelOrSku.toLowerCase().trim();
    return this.records.find((r) => r.category === category && (r.model.toLowerCase().includes(clean) || (r.partNumber && r.partNumber.toLowerCase().includes(clean)))) || null;
  }

  getStats(): SourceAdapterStats {
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      executionMode: this.executionMode,
      officialDomains: this.officialDomains,
      categoriesSupported: this.supportedCategories,
      totalRecords: this.records.length,
      activeModels: this.records.length,
      legacyModels: 0,
      discontinuedModels: 0,
      recordsWithEvidence: this.records.length,
      unknownFieldsTotal: 0,
      lastIngestionAt: '2024-05-10T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}

// ============================================================================
// 3. SEASONIC OFFICIAL SOURCE ADAPTER
// ============================================================================
export class SeasonicSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'seasonic-psu-official';
  readonly manufacturer = 'Seasonic';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['seasonic.com'];
  readonly supportedCategories: SubsystemType[] = ['psu'];

  private records: MasterComponentRecord[] = [
    // PSU: SEASONIC VERTEX GX-1000 (ATX 3.0 / PCIe 5.0)
    {
      id: 'seasonic-vertex-gx-1000-atx30',
      category: 'psu',
      manufacturer: 'Seasonic',
      family: 'VERTEX Series',
      model: 'Seasonic VERTEX GX-1000 1000W 80+ Gold Fully Modular ATX 3.0',
      exactModel: 'VERTEX GX-1000',
      partNumber: 'VERTEX-GX-1000',
      sku: 'VERTEX-GX-1000',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-12-01',
      specsSummary: '1000W • 80 PLUS Gold & Cybenetics Gold • ATX 3.0 & PCIe 5.0 Ready • Cable nativo 16-pin 12VHPWR (hasta 600W) • Ventilador FDB 135mm con control híbrido silencioso • 160 mm de profundidad',
      specifications: {
        wattageW: 1000,
        rating: '80+ Gold',
        cybeneticsEfficiency: 'Gold',
        atxVersion: 'ATX 3.0 (PCIe 5.0 Ready)',
        modularity: 'Fully Modular',
        fanSizeMm: 135,
        hybridFanMode: true,
        connectors: {
          atx24Pin: 1,
          eps12v8Pin: 2,
          pcie12VHPWR: 1, // 16-pin 600W
          pcie8PinClassic: 3,
          sata: 14,
          molex: 3,
        },
        dimensionsMm: '160 x 150 x 86',
        warrantyYears: 10,
      },
      fieldEvidence: {
        wattage: { value: 1000, sourceUrl: 'https://seasonic.com/vertex-gx', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
        atxStandard: { value: 'ATX 3.0 / PCIe 5.0', sourceUrl: 'https://seasonic.com/vertex-gx', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'Seasonic VERTEX GX-1000 Official Specs', url: 'https://seasonic.com/vertex-gx', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 199,
    },
  ];

  async fetchCatalog(category: SubsystemType): Promise<IngestionBatchResult> {
    const filtered = this.records.filter((r) => r.category === category);
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      category,
      totalFound: filtered.length,
      modelsImported: filtered,
      duplicatesDetected: 0,
      unknownFieldsCount: 0,
      failedItems: [],
      lastVerifiedAt: new Date().toISOString(),
    };
  }

  async fetchComponentDetails(modelOrSku: string, category: SubsystemType): Promise<MasterComponentRecord | null> {
    const clean = modelOrSku.toLowerCase().trim();
    return this.records.find((r) => r.category === category && (r.model.toLowerCase().includes(clean) || (r.partNumber && r.partNumber.toLowerCase().includes(clean)))) || null;
  }

  getStats(): SourceAdapterStats {
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      executionMode: this.executionMode,
      officialDomains: this.officialDomains,
      categoriesSupported: this.supportedCategories,
      totalRecords: this.records.length,
      activeModels: this.records.length,
      legacyModels: 0,
      discontinuedModels: 0,
      recordsWithEvidence: this.records.length,
      unknownFieldsTotal: 0,
      lastIngestionAt: '2024-05-10T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}
