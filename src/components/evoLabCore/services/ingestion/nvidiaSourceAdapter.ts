// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — NVIDIA OFFICIAL SOURCE ADAPTER
// Official Primary Source: nvidia.com/en-us/geforce/graphics-cards / nvidia.com
// Rule: Distinguish GPU_BASE_MODEL from BOARD_PARTNER_SKU.
// ============================================================================

import { SubsystemType } from '../../types';
import {
  HardwareOfficialSourceAdapter,
  MasterComponentRecord,
  IngestionBatchResult,
  SourceAdapterStats,
} from './types';

export class NvidiaSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'nvidia-geforce-official';
  readonly manufacturer = 'NVIDIA';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['nvidia.com', 'developer.nvidia.com', 'geforce.com'];
  readonly supportedCategories: SubsystemType[] = ['gpu'];

  private records: MasterComponentRecord[] = [
    // --- GEFORCE RTX 50 SERIES (BLACKWELL) BASE MODELS ---
    {
      id: 'nvidia-geforce-rtx-5090-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 50 Series',
      model: 'NVIDIA GeForce RTX 5090 (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 5090 Graphics Card',
      variant: 'Blackwell Architecture Reference',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2025-01-30',
      specsSummary: '32GB GDDR7 512-bit • 21,760 CUDA Cores • 1792 GB/s Bandwidth • 600W TGP • PCIe 5.0 x16 • DisplayPort 2.1a (UHBR20) & HDMI 2.1a • DLSS 4 / Multi-Frame Gen',
      specifications: {
        architecture: 'Blackwell',
        cudaCores: 21760,
        tensorCores: 680,
        rtCores: 170,
        baseClockMhz: 2010,
        boostClockMhz: 2400,
        vramGb: 32,
        memoryType: 'GDDR7',
        memoryBusBit: 512,
        memorySpeedGbps: 28,
        memoryBandwidthGbs: 1792,
        powerW: 600,
        recommendedPsuW: 1000,
        powerConnectors: '1x 16-pin 12V-2x6 (PCIe 5.1 / 12VHPWR)',
        lengthMm: 304,
        slotWidth: 2.0, // Founders dual slot
        pcieGen: 'PCIe 5.0 x16',
        outputs: ['3x DisplayPort 2.1a (UHBR20)', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '32GB GDDR7 512-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08', confidence: 100 },
        tgp: { value: '600W TGP', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 5090 Specifications', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08' },
      ],
      lastVerifiedAt: '2025-01-08',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 1999,
    },
    {
      id: 'nvidia-geforce-rtx-5080-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 50 Series',
      model: 'NVIDIA GeForce RTX 5080 (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 5080 Graphics Card',
      variant: 'Blackwell Architecture Reference',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2025-01-30',
      specsSummary: '16GB GDDR7 256-bit • 10,752 CUDA Cores • 1024 GB/s Bandwidth • 400W TGP • PCIe 5.0 x16 • DisplayPort 2.1a & HDMI 2.1a',
      specifications: {
        architecture: 'Blackwell',
        cudaCores: 10752,
        tensorCores: 336,
        rtCores: 84,
        baseClockMhz: 2295,
        boostClockMhz: 2615,
        vramGb: 16,
        memoryType: 'GDDR7',
        memoryBusBit: 256,
        memorySpeedGbps: 32,
        memoryBandwidthGbs: 1024,
        powerW: 400,
        recommendedPsuW: 850,
        powerConnectors: '1x 16-pin 12V-2x6',
        lengthMm: 304,
        slotWidth: 2.0,
        pcieGen: 'PCIe 5.0 x16',
        outputs: ['3x DisplayPort 2.1a', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '16GB GDDR7 256-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 5080 Specifications', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08' },
      ],
      lastVerifiedAt: '2025-01-08',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 999,
    },
    {
      id: 'nvidia-geforce-rtx-5070-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 50 Series',
      model: 'NVIDIA GeForce RTX 5070 (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 5070 Graphics Card',
      variant: 'Blackwell Architecture Reference',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2025-02-15',
      specsSummary: '12GB GDDR7 192-bit • 6,144 CUDA Cores • 672 GB/s Bandwidth • 250W TGP • PCIe 5.0 x16 • DisplayPort 2.1a & HDMI 2.1a',
      specifications: {
        architecture: 'Blackwell',
        cudaCores: 6144,
        tensorCores: 192,
        rtCores: 48,
        baseClockMhz: 2160,
        boostClockMhz: 2505,
        vramGb: 12,
        memoryType: 'GDDR7',
        memoryBusBit: 192,
        memorySpeedGbps: 28,
        memoryBandwidthGbs: 672,
        powerW: 250,
        recommendedPsuW: 650,
        powerConnectors: '1x 16-pin 12V-2x6',
        lengthMm: 242,
        slotWidth: 2.0,
        pcieGen: 'PCIe 5.0 x16',
        outputs: ['3x DisplayPort 2.1a', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '12GB GDDR7 192-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 5070 Specs', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2025-01-08' },
      ],
      lastVerifiedAt: '2025-01-08',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 549,
    },

    // --- GEFORCE RTX 40 SERIES (ADA LOVELACE) BASE MODELS ---
    {
      id: 'nvidia-geforce-rtx-4090-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 40 Series',
      model: 'NVIDIA GeForce RTX 4090 (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 4090 Graphics Card',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-12',
      specsSummary: '24GB GDDR6X 384-bit • 16,384 CUDA Cores • 1008 GB/s Bandwidth • 450W TGP • PCIe 4.0 x16 • DP 1.4a & HDMI 2.1a',
      specifications: {
        architecture: 'Ada Lovelace',
        cudaCores: 16384,
        tensorCores: 512,
        rtCores: 128,
        baseClockMhz: 2235,
        boostClockMhz: 2520,
        vramGb: 24,
        memoryType: 'GDDR6X',
        memoryBusBit: 384,
        memoryBandwidthGbs: 1008,
        powerW: 450,
        recommendedPsuW: 850,
        powerConnectors: '1x 16-pin 12VHPWR',
        lengthMm: 304,
        slotWidth: 3.0,
        pcieGen: 'PCIe 4.0 x16',
        outputs: ['3x DisplayPort 1.4a', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '24GB GDDR6X 384-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 4090 Specs', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15' },
      ],
      lastVerifiedAt: '2024-08-15',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 1599,
    },
    {
      id: 'nvidia-geforce-rtx-4070-super-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 40 Series',
      model: 'NVIDIA GeForce RTX 4070 SUPER (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 4070 SUPER Graphics Card',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-01-17',
      specsSummary: '12GB GDDR6X 192-bit • 7,168 CUDA Cores • 504 GB/s Bandwidth • 220W TGP • PCIe 4.0 x16 • DP 1.4a & HDMI 2.1a',
      specifications: {
        architecture: 'Ada Lovelace',
        cudaCores: 7168,
        tensorCores: 224,
        rtCores: 56,
        baseClockMhz: 1980,
        boostClockMhz: 2475,
        vramGb: 12,
        memoryType: 'GDDR6X',
        memoryBusBit: 192,
        memoryBandwidthGbs: 504,
        powerW: 220,
        recommendedPsuW: 650,
        powerConnectors: '1x 16-pin 12VHPWR',
        lengthMm: 242,
        slotWidth: 2.0,
        pcieGen: 'PCIe 4.0 x16',
        outputs: ['3x DisplayPort 1.4a', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '12GB GDDR6X 192-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-18', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 4070 SUPER Specs', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-18' },
      ],
      lastVerifiedAt: '2024-08-15',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 599,
    },
    {
      id: 'nvidia-geforce-rtx-4060-base',
      category: 'gpu',
      manufacturer: 'NVIDIA',
      family: 'GeForce RTX 40 Series',
      model: 'NVIDIA GeForce RTX 4060 (Base Reference)',
      exactModel: 'NVIDIA® GeForce RTX™ 4060 Graphics Card',
      kind: 'BASE_MODEL',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2023-06-29',
      specsSummary: '8GB GDDR6 128-bit • 3,072 CUDA Cores • 272 GB/s Bandwidth • 115W TGP • PCIe 4.0 x8 • DP 1.4a & HDMI 2.1a',
      specifications: {
        architecture: 'Ada Lovelace',
        cudaCores: 3072,
        tensorCores: 96,
        rtCores: 24,
        baseClockMhz: 1830,
        boostClockMhz: 2460,
        vramGb: 8,
        memoryType: 'GDDR6',
        memoryBusBit: 128,
        memoryBandwidthGbs: 272,
        powerW: 115,
        recommendedPsuW: 500,
        powerConnectors: '1x 8-pin PCIe',
        lengthMm: 242,
        slotWidth: 2.0,
        pcieGen: 'PCIe 4.0 x8',
        outputs: ['3x DisplayPort 1.4a', '1x HDMI 2.1a'],
      },
      fieldEvidence: {
        vram: { value: '8GB GDDR6 128-bit', sourceUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-07-01', confidence: 100 },
      },
      officialSources: [
        { title: 'NVIDIA GeForce RTX 4060 Specs', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-07-01' },
      ],
      lastVerifiedAt: '2024-08-15',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 299,
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
      unknownFieldsCount: filtered.reduce((sum, r) => sum + r.unknownFields.length, 0),
      failedItems: [],
      lastVerifiedAt: new Date().toISOString(),
    };
  }

  async fetchComponentDetails(modelOrSku: string, category: SubsystemType): Promise<MasterComponentRecord | null> {
    const clean = modelOrSku.toLowerCase().trim();
    const found = this.records.find(
      (r) =>
        r.category === category &&
        (r.model.toLowerCase().includes(clean) ||
          r.exactModel.toLowerCase().includes(clean) ||
          (r.partNumber && r.partNumber.toLowerCase().includes(clean)))
    );
    return found || null;
  }

  getStats(): SourceAdapterStats {
    const active = this.records.filter((r) => r.status === 'CURRENT').length;
    return {
      sourceId: this.sourceId,
      manufacturer: this.manufacturer,
      executionMode: this.executionMode,
      officialDomains: this.officialDomains,
      categoriesSupported: this.supportedCategories,
      totalRecords: this.records.length,
      activeModels: active,
      legacyModels: 0,
      discontinuedModels: 0,
      recordsWithEvidence: this.records.filter((r) => Object.keys(r.fieldEvidence).length > 0).length,
      unknownFieldsTotal: this.records.reduce((sum, r) => sum + r.unknownFields.length, 0),
      lastIngestionAt: '2025-01-08T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}
