// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — BOARD PARTNERS OFFICIAL SOURCE ADAPTERS
// Brands: ASUS, MSI, GIGABYTE, ASROCK
// Rigor: Motherboards with CPU Support Lists & BIOS Versions + Exact GPU SKUs
// ============================================================================

import { SubsystemType } from '../../types';
import {
  HardwareOfficialSourceAdapter,
  MasterComponentRecord,
  IngestionBatchResult,
  SourceAdapterStats,
  CpuSupportEntry,
  BiosReleaseEntry,
} from './types';

// ============================================================================
// 1. ASUS OFFICIAL SOURCE ADAPTER
// ============================================================================
export class AsusSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'asus-rog-tuf-official';
  readonly manufacturer = 'ASUS';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['asus.com', 'rog.asus.com', 'dlcdnets.asus.com'];
  readonly supportedCategories: SubsystemType[] = ['motherboard', 'gpu', 'psu', 'case', 'cooling'];

  private records: MasterComponentRecord[] = [
    // MOTHERBOARD: ROG MAXIMUS Z890 HERO (LGA1851)
    {
      id: 'asus-rog-maximus-z890-hero',
      category: 'motherboard',
      manufacturer: 'ASUS',
      family: 'ROG - Republic of Gamers',
      model: 'ASUS ROG MAXIMUS Z890 HERO',
      exactModel: 'ROG MAXIMUS Z890 HERO Gaming Motherboard',
      partNumber: '90MB1IG0-M0EAY0',
      sku: '90MB1IG0-M0EAY0',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-10-24',
      specsSummary: 'Socket LGA1851 • Intel Z890 • ATX • 4x DDR5 hasta 8800+ MT/s (CUDIMM) • 6x M.2 (3x PCIe 5.0 + 3x PCIe 4.0) • Wi-Fi 7 + 5Gb Ethernet • Thunderbolt 4 Dual',
      specifications: {
        socket: 'LGA1851',
        chipset: 'Intel Z890',
        formFactor: 'ATX',
        dimensionsMm: '305 x 244',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 192,
        memorySpeeds: 'DDR5 8800+(OC)/8400(OC)/7200(OC)/6400 JEDEC',
        pcieSlots: '1x PCIe 5.0 x16 (x16 or x8/x8), 1x PCIe 4.0 x16 (x4 mode)',
        m2Slots: '6 total (3x PCIe 5.0 x4, 3x PCIe 4.0 x4)',
        sataPorts: 4,
        lan: '1x Intel 2.5Gb + 1x Realtek 5Gb Ethernet',
        wifi: 'Intel Wi-Fi 7 (802.11be) 2x2 320MHz + BT 5.4',
        audio: 'ROG SupremeFX 7.1 ALC4082 + ESS ES9219 QUAD DAC',
        powerConnectors: '24-pin ATX, 2x 8-pin EPS 12V, 1x 8-pin PCIe power',
        vrmPhases: '22+1+2+2 Power Stages (110A)',
      },
      fieldEvidence: {
        socket: { value: 'LGA1851', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-25', confidence: 100 },
        vrm: { value: '22+1+2+2 (110A)', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-25', confidence: 100 },
      },
      officialSources: [
        { title: 'ASUS ROG MAXIMUS Z890 HERO Official Specs', url: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-25' },
      ],
      cpuSupportList: [
        { cpuModel: 'Intel Core Ultra 9 285K', socket: 'LGA1851', sinceBiosVersion: '0403', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/helpdesk_cpu/', verifiedAt: '2024-10-25' },
        { cpuModel: 'Intel Core Ultra 7 265K', socket: 'LGA1851', sinceBiosVersion: '0403', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/helpdesk_cpu/', verifiedAt: '2024-10-25' },
        { cpuModel: 'Intel Core Ultra 5 245K', socket: 'LGA1851', sinceBiosVersion: '0403', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/helpdesk_cpu/', verifiedAt: '2024-10-25' },
      ],
      biosReleases: [
        { version: '0403', releaseDate: '2024-10-15', description: 'First release BIOS for Arrow Lake-S', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/helpdesk_bios/' },
        { version: '0805', releaseDate: '2024-11-20', description: 'Improve DDR5 CUDIMM high-frequency stability', sourceUrl: 'https://rog.asus.com/motherboards/rog-maximus/rog-maximus-z890-hero-model/helpdesk_bios/' },
      ],
      lastVerifiedAt: '2024-11-20',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 699,
    },

    // MOTHERBOARD: ASUS TUF GAMING B650-PLUS WIFI (AM5)
    {
      id: 'asus-tuf-gaming-b650-plus-wifi',
      category: 'motherboard',
      manufacturer: 'ASUS',
      family: 'TUF GAMING',
      model: 'ASUS TUF GAMING B650-PLUS WIFI',
      exactModel: 'TUF GAMING B650-PLUS WIFI ATX Motherboard',
      partNumber: '90MB1BY0-M0EAY0',
      sku: '90MB1BY0-M0EAY0',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-04',
      specsSummary: 'Socket AM5 • AMD B650 • ATX • 4x DDR5 hasta 7600+ MT/s • 3x M.2 (1x PCIe 5.0 + 2x PCIe 4.0) • Wi-Fi 6 + 2.5Gb LAN • 12+2 DrMOS VRM',
      specifications: {
        socket: 'AM5',
        chipset: 'AMD B650',
        formFactor: 'ATX',
        dimensionsMm: '305 x 244',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 192,
        memorySpeeds: 'DDR5 7600+(OC)/6400(OC)/5600/5200 MT/s',
        pcieSlots: '1x PCIe 4.0/5.0 x16, 1x PCIe 4.0 x16 (x4 mode), 2x PCIe 4.0 x1',
        m2Slots: '3 total (1x PCIe 5.0 x4 M.2 2280, 2x PCIe 4.0 x4)',
        sataPorts: 4,
        lan: 'Realtek 2.5Gb Ethernet',
        wifi: 'Wi-Fi 6 (802.11ax) + Bluetooth 5.2',
        audio: 'Realtek 7.1 Surround Sound High Definition Audio CODEC',
        vrmPhases: '12+2 Power Stages (60A)',
      },
      fieldEvidence: {
        socket: { value: 'AM5', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'ASUS TUF B650-PLUS WIFI Specs', url: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      cpuSupportList: [
        { cpuModel: 'AMD Ryzen 7 7800X3D', socket: 'AM5', sinceBiosVersion: '1409', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/helpdesk_cpu/', verifiedAt: '2023-04-10' },
        { cpuModel: 'AMD Ryzen 7 9800X3D', socket: 'AM5', sinceBiosVersion: '3024', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/helpdesk_cpu/', verifiedAt: '2024-11-05' },
        { cpuModel: 'AMD Ryzen 9 9950X', socket: 'AM5', sinceBiosVersion: '2613', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/helpdesk_cpu/', verifiedAt: '2024-08-01' },
      ],
      biosReleases: [
        { version: '1409', releaseDate: '2023-04-05', agesaOrMicrocode: 'ComboAM5PI 1.0.0.6', description: 'Support Ryzen 7000X3D series', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/helpdesk_bios/' },
        { version: '3024', releaseDate: '2024-10-28', agesaOrMicrocode: 'ComboAM5PI 1.2.0.2', description: 'Support Ryzen 9000X3D series & Performance improvements', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650-plus-wifi/helpdesk_bios/' },
      ],
      lastVerifiedAt: '2024-11-05',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 199,
    },

    // MOTHERBOARD: ASUS PRIME B760M-A WIFI D4 (LGA1700 - DDR4)
    {
      id: 'asus-prime-b760m-a-wifi-d4',
      category: 'motherboard',
      manufacturer: 'ASUS',
      family: 'PRIME',
      model: 'ASUS PRIME B760M-A WIFI D4',
      exactModel: 'PRIME B760M-A WIFI D4 Micro-ATX Motherboard',
      partNumber: '90MB14Z0-M0EAY0',
      sku: '90MB14Z0-M0EAY0',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2023-01-03',
      specsSummary: 'Socket LGA1700 • Intel B760 • Micro-ATX • 4x DDR4 hasta 5333(OC) MT/s • 2x M.2 PCIe 4.0 • Wi-Fi 6 + 2.5Gb Realtek LAN',
      specifications: {
        socket: 'LGA1700',
        chipset: 'Intel B760',
        formFactor: 'Micro-ATX',
        dimensionsMm: '244 x 244',
        memoryType: 'DDR4',
        memorySlots: 4,
        maxMemoryGb: 128,
        memorySpeeds: 'DDR4 5333(OC)/3200/3000/2933/2666/2400/2133',
        pcieSlots: '1x PCIe 4.0 x16 (x16 mode), 1x PCIe 4.0 x16 (x4 mode), 1x PCIe 4.0 x16 (x1 mode)',
        m2Slots: '2x M.2 2280 PCIe 4.0 x4',
        sataPorts: 4,
        lan: 'Realtek 2.5Gb Ethernet',
        wifi: 'Wi-Fi 6 (802.11ax) + Bluetooth 5.2',
        audio: 'Realtek 7.1 Surround Sound High Definition Audio',
      },
      fieldEvidence: {
        socket: { value: 'LGA1700', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-01-10', confidence: 100 },
        ramType: { value: 'DDR4', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-01-10', confidence: 100 },
      },
      officialSources: [
        { title: 'ASUS PRIME B760M-A WIFI D4 Specs', url: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-01-10' },
      ],
      cpuSupportList: [
        { cpuModel: 'Intel Core i5-12400', socket: 'LGA1700', sinceBiosVersion: '0401', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/helpdesk_cpu/', verifiedAt: '2023-01-10' },
        { cpuModel: 'Intel Core i5-13400', socket: 'LGA1700', sinceBiosVersion: '0401', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/helpdesk_cpu/', verifiedAt: '2023-01-10' },
        { cpuModel: 'Intel Core i7-14700K', socket: 'LGA1700', sinceBiosVersion: '1402', sourceUrl: 'https://www.asus.com/motherboards-components/motherboards/prime/prime-b760m-a-wifi-d4/helpdesk_cpu/', verifiedAt: '2023-10-15' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 149,
    },

    // GPU: ASUS ROG STRIX GEFORCE RTX 4090 OC 24GB (EXACT BOARD-PARTNER SKU)
    {
      id: 'asus-rog-strix-rtx4090-o24g-gaming',
      category: 'gpu',
      manufacturer: 'ASUS',
      family: 'ROG Strix',
      model: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB',
      exactModel: 'ROG-STRIX-RTX4090-O24G-GAMING',
      partNumber: '90YV0ID0-M0NA00',
      sku: 'ROG-STRIX-RTX4090-O24G-GAMING',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-12',
      specsSummary: '24GB GDDR6X 384-bit • 2640 MHz Boost (OC Mode) • 357.6 mm de largo • 3.5 Slots (70.1 mm) • 1x 16-pin 12VHPWR • Recomendada PSU 1000W',
      specifications: {
        baseModelId: 'nvidia-geforce-rtx-4090-base',
        boostClockMhz: 2640,
        vramGb: 24,
        memoryType: 'GDDR6X',
        memoryBusBit: 384,
        powerW: 450,
        recommendedPsuW: 1000,
        powerConnectors: '1x 16-pin 12VHPWR (PCIe Gen 5)',
        lengthMm: 357.6,
        heightMm: 149.3,
        thicknessMm: 70.1,
        slotWidth: 3.5,
        cooler: 'Tri-Fan Axial-tech con cámara de vapor patentada',
        outputs: ['2x Native HDMI 2.1a', '3x Native DisplayPort 1.4a'],
        pcieGen: 'PCIe 4.0 x16',
      },
      fieldEvidence: {
        lengthMm: { value: 357.6, sourceUrl: 'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4090-o24g-gaming-model/spec/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15', confidence: 100 },
        slotWidth: { value: 3.5, sourceUrl: 'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4090-o24g-gaming-model/spec/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15', confidence: 100 },
        recommendedPsu: { value: '1000W', sourceUrl: 'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4090-o24g-gaming-model/spec/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15', confidence: 100 },
      },
      officialSources: [
        { title: 'ROG Strix RTX 4090 OC Tech Specs', url: 'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4090-o24g-gaming-model/spec/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2022-10-15' },
      ],
      lastVerifiedAt: '2024-06-01',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 1999,
    },

    // GPU: ASUS DUAL GEFORCE RTX 4070 SUPER OC 12GB
    {
      id: 'asus-dual-rtx4070s-o12g',
      category: 'gpu',
      manufacturer: 'ASUS',
      family: 'DUAL',
      model: 'ASUS Dual GeForce RTX 4070 SUPER OC Edition 12GB',
      exactModel: 'DUAL-RTX4070S-O12G',
      partNumber: '90YV0K40-M0NA00',
      sku: 'DUAL-RTX4070S-O12G',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-01-17',
      specsSummary: '12GB GDDR6X 192-bit • 2550 MHz OC Boost • 267.01 mm de largo • 2.56 Slots (51.13 mm) • 1x 16-pin 12VHPWR • Recomendada PSU 750W',
      specifications: {
        baseModelId: 'nvidia-geforce-rtx-4070-super-base',
        boostClockMhz: 2550,
        vramGb: 12,
        memoryType: 'GDDR6X',
        memoryBusBit: 192,
        powerW: 220,
        recommendedPsuW: 750,
        powerConnectors: '1x 16-pin 12VHPWR',
        lengthMm: 267.01,
        heightMm: 133.94,
        thicknessMm: 51.13,
        slotWidth: 2.56,
        cooler: 'Dual Fan Axial-tech con rodamientos dobles de bolas',
        outputs: ['1x Native HDMI 2.1a', '3x Native DisplayPort 1.4a'],
        pcieGen: 'PCIe 4.0 x16',
      },
      fieldEvidence: {
        lengthMm: { value: 267.01, sourceUrl: 'https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4070s-o12g/techspec/', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-20', confidence: 100 },
      },
      officialSources: [
        { title: 'ASUS Dual RTX 4070 SUPER OC Tech Specs', url: 'https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx4070s-o12g/techspec/', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-20' },
      ],
      lastVerifiedAt: '2024-08-15',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 619,
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
      lastIngestionAt: '2024-11-20T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}

// ============================================================================
// 2. MSI OFFICIAL SOURCE ADAPTER
// ============================================================================
export class MsiSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'msi-gaming-official';
  readonly manufacturer = 'MSI';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['msi.com', 'download.msi.com'];
  readonly supportedCategories: SubsystemType[] = ['motherboard', 'gpu', 'psu', 'case', 'cooling'];

  private records: MasterComponentRecord[] = [
    // MOTHERBOARD: MSI MAG B650 TOMAHAWK WIFI
    {
      id: 'msi-mag-b650-tomahawk-wifi',
      category: 'motherboard',
      manufacturer: 'MSI',
      family: 'MAG - MSI Arsenal Gaming',
      model: 'MSI MAG B650 TOMAHAWK WIFI',
      exactModel: 'MAG B650 TOMAHAWK WIFI Gaming Motherboard',
      partNumber: '7D75-001R',
      sku: '7D75-001R',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-10',
      specsSummary: 'Socket AM5 • AMD B650 • ATX • 4x DDR5 hasta 7600+(OC) MT/s • 3x M.2 (2x PCIe 4.0 x4 + 1x PCIe 4.0 x2) • Wi-Fi 6E + 2.5Gb Realtek LAN • 14+2+1 Duet Rail VRM',
      specifications: {
        socket: 'AM5',
        chipset: 'AMD B650',
        formFactor: 'ATX',
        dimensionsMm: '304.8 x 243.84',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 192,
        memorySpeeds: 'DDR5 7600+(OC)/ 6400(OC)/ 5600(JEDEC)/ 4800(JEDEC) MT/s',
        pcieSlots: '1x PCIe 4.0 x16 (x16 mode), 1x PCIe 4.0 x16 (x4 mode), 1x PCIe 3.0 x1',
        m2Slots: '3x M.2 PCIe 4.0',
        sataPorts: 6,
        lan: 'Realtek RTL8125BG 2.5Gbps LAN',
        wifi: 'AMD Wi-Fi 6E RZ616 + Bluetooth 5.3',
        audio: 'Realtek ALC4080 Codec 7.1 HD Audio',
        vrmPhases: '14+2+1 Power Stages (80A SPS)',
      },
      fieldEvidence: {
        socket: { value: 'AM5', sourceUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'MSI MAG B650 TOMAHAWK WIFI Specs', url: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      cpuSupportList: [
        { cpuModel: 'AMD Ryzen 7 7800X3D', socket: 'AM5', sinceBiosVersion: '7D75v13', sourceUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support#cpu', verifiedAt: '2023-04-10' },
        { cpuModel: 'AMD Ryzen 7 9800X3D', socket: 'AM5', sinceBiosVersion: '7D75v1J', sourceUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support#cpu', verifiedAt: '2024-11-06' },
      ],
      biosReleases: [
        { version: '7D75v13', releaseDate: '2023-04-06', agesaOrMicrocode: 'ComboAM5PI 1.0.0.6', description: 'Support Ryzen 7000X3D', sourceUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support#bios' },
        { version: '7D75v1J', releaseDate: '2024-10-30', agesaOrMicrocode: 'ComboAM5PI 1.2.0.2', description: 'Support Ryzen 9000X3D and optimized memory latency', sourceUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support#bios' },
      ],
      lastVerifiedAt: '2024-11-06',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 219,
    },

    // MOTHERBOARD: MSI PRO Z790-A MAX WIFI (LGA1700)
    {
      id: 'msi-pro-z790-a-max-wifi',
      category: 'motherboard',
      manufacturer: 'MSI',
      family: 'PRO Series',
      model: 'MSI PRO Z790-A MAX WIFI',
      exactModel: 'PRO Z790-A MAX WIFI Motherboard',
      partNumber: '7E07-002R',
      sku: '7E07-002R',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2023-10-17',
      specsSummary: 'Socket LGA1700 • Intel Z790 • ATX • 4x DDR5 hasta 7800+(OC) MT/s • 4x M.2 (1x PCIe 5.0 + 3x PCIe 4.0) • Wi-Fi 7 + 2.5Gb LAN • 16+1+1 Duet Rail VRM',
      specifications: {
        socket: 'LGA1700',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 192,
        memorySpeeds: 'DDR5 7800+(OC)/ 5600(JEDEC) MT/s',
        pcieSlots: '1x PCIe 5.0 x16, 1x PCIe 4.0 x16 (x4 mode), 2x PCIe 3.0 x1',
        m2Slots: '4x M.2 PCIe',
        sataPorts: 6,
        lan: 'Intel 2.5Gbps LAN',
        wifi: 'Wi-Fi 7 Solution + Bluetooth 5.4',
        audio: 'Realtek ALC4080 7.1 HD Audio',
      },
      fieldEvidence: {
        socket: { value: 'LGA1700', sourceUrl: 'https://www.msi.com/Motherboard/PRO-Z790-A-MAX-WIFI/Specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-10-20', confidence: 100 },
      },
      officialSources: [
        { title: 'MSI PRO Z790-A MAX WIFI Specs', url: 'https://www.msi.com/Motherboard/PRO-Z790-A-MAX-WIFI/Specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2023-10-20' },
      ],
      cpuSupportList: [
        { cpuModel: 'Intel Core i9-14900K', socket: 'LGA1700', sinceBiosVersion: '7E07vM0', sourceUrl: 'https://www.msi.com/Motherboard/PRO-Z790-A-MAX-WIFI/support#cpu', verifiedAt: '2023-10-20' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 239,
    },

    // GPU: MSI GEFORCE RTX 4070 Ti SUPER 16G GAMING X SLIM
    {
      id: 'msi-geforce-rtx-4070ti-super-16g-gaming-x-slim',
      category: 'gpu',
      manufacturer: 'MSI',
      family: 'GAMING SLIM',
      model: 'MSI GeForce RTX 4070 Ti SUPER 16G GAMING X SLIM',
      exactModel: 'GeForce RTX™ 4070 Ti SUPER 16G GAMING X SLIM',
      partNumber: 'G407TSGXSL',
      sku: 'G407TSGXSL',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-01-24',
      specsSummary: '16GB GDDR6X 256-bit • 2685 MHz Extreme Boost • 307 mm de largo • 2.5 Slots (51 mm) • 1x 16-pin 12VHPWR • Recomendada PSU 700W',
      specifications: {
        boostClockMhz: 2685,
        vramGb: 16,
        memoryType: 'GDDR6X',
        memoryBusBit: 256,
        powerW: 285,
        recommendedPsuW: 700,
        powerConnectors: '1x 16-pin 12VHPWR',
        lengthMm: 307,
        heightMm: 125,
        thicknessMm: 51,
        slotWidth: 2.5,
        cooler: 'TRI FROZR 3 con ventiladores TORX FAN 5.0',
        outputs: ['3x DisplayPort 1.4a', '1x HDMI 2.1a'],
        pcieGen: 'PCIe 4.0 x16',
      },
      fieldEvidence: {
        lengthMm: { value: 307, sourceUrl: 'https://www.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-GAMING-X-SLIM/Specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-25', confidence: 100 },
      },
      officialSources: [
        { title: 'MSI RTX 4070 Ti SUPER GAMING X SLIM Specs', url: 'https://www.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-GAMING-X-SLIM/Specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-01-25' },
      ],
      lastVerifiedAt: '2024-08-15',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 849,
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
      lastIngestionAt: '2024-11-06T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}

// ============================================================================
// 3. GIGABYTE OFFICIAL SOURCE ADAPTER
// ============================================================================
export class GigabyteSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'gigabyte-aorus-official';
  readonly manufacturer = 'GIGABYTE';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['gigabyte.com', 'aorus.com', 'download.gigabyte.com'];
  readonly supportedCategories: SubsystemType[] = ['motherboard', 'gpu', 'psu'];

  private records: MasterComponentRecord[] = [
    // MOTHERBOARD: GIGABYTE B650 AORUS ELITE AX
    {
      id: 'gigabyte-b650-aorus-elite-ax',
      category: 'motherboard',
      manufacturer: 'GIGABYTE',
      family: 'AORUS',
      model: 'GIGABYTE B650 AORUS ELITE AX',
      exactModel: 'B650 AORUS ELITE AX (rev. 1.2)',
      revision: '1.2',
      partNumber: 'B650 AORUS ELITE AX',
      sku: 'B650-AORUS-ELITE-AX-1.2',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2022-10-04',
      specsSummary: 'Socket AM5 • AMD B650 • ATX • 4x DDR5 hasta 8000(OC) MT/s • 3x M.2 (1x PCIe 5.0 x4 + 2x PCIe 4.0 x4) • Wi-Fi 6E + 2.5Gb Realtek LAN • 14+2+1 VRM (70A)',
      specifications: {
        socket: 'AM5',
        chipset: 'AMD B650',
        formFactor: 'ATX',
        dimensionsMm: '305 x 244',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 192,
        memorySpeeds: 'DDR5 8000(OC)/7600(OC)/6000(OC)/5200 MT/s',
        pcieSlots: '1x PCIe 4.0 x16, 2x PCIe 3.0 x16 (x1 mode)',
        m2Slots: '1x M.2 PCIe 5.0 x4 + 2x M.2 PCIe 4.0 x4',
        sataPorts: 4,
        lan: 'Realtek 2.5GbE LAN',
        wifi: 'Intel Wi-Fi 6E AX210 / Realtek RTL8852CE',
        audio: 'Realtek Audio CODEC 7.1',
        vrmPhases: '14+2+1 Twin Digital VRM (70A SPS)',
      },
      fieldEvidence: {
        socket: { value: 'AM5', sourceUrl: 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX-rev-12/sp#sp', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10', confidence: 100 },
      },
      officialSources: [
        { title: 'GIGABYTE B650 AORUS ELITE AX Rev 1.2 Specs', url: 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX-rev-12/sp#sp', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-05-10' },
      ],
      cpuSupportList: [
        { cpuModel: 'AMD Ryzen 7 7800X3D', socket: 'AM5', sinceBiosVersion: 'FB', sourceUrl: 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX-rev-12/support#support-cpu', verifiedAt: '2023-04-10' },
        { cpuModel: 'AMD Ryzen 7 9800X3D', socket: 'AM5', sinceBiosVersion: 'FCd', sourceUrl: 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX-rev-12/support#support-cpu', verifiedAt: '2024-11-06' },
      ],
      lastVerifiedAt: '2024-11-06',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 219,
    },

    // MOTHERBOARD: GIGABYTE B550 AORUS ELITE V2 (AM4)
    {
      id: 'gigabyte-b550-aorus-elite-v2',
      category: 'motherboard',
      manufacturer: 'GIGABYTE',
      family: 'AORUS',
      model: 'GIGABYTE B550 AORUS ELITE V2',
      exactModel: 'B550 AORUS ELITE V2 (rev. 1.0/1.1)',
      partNumber: 'B550 AORUS ELITE V2',
      sku: 'B550-AORUS-ELITE-V2',
      kind: 'EXACT_SKU',
      lifecycle: 'LEGACY',
      status: 'LEGACY',
      releaseDate: '2020-06-16',
      specsSummary: 'Socket AM4 • AMD B550 • ATX • 4x DDR4 hasta 4733(OC) MT/s • 2x M.2 (1x PCIe 4.0 x4 + 1x PCIe 3.0 x4) • Realtek 2.5GbE LAN • 12+2 DrMOS VRM (50A)',
      specifications: {
        socket: 'AM4',
        chipset: 'AMD B550',
        formFactor: 'ATX',
        memoryType: 'DDR4',
        memorySlots: 4,
        maxMemoryGb: 128,
        memorySpeeds: 'DDR4 4733(OC)/ 3200/ 2933/ 2667 MT/s',
        pcieSlots: '1x PCIe 4.0 x16, 1x PCIe 3.0 x16 (x2), 1x PCIe 3.0 x16 (x1), 1x PCIe 3.0 x1',
        m2Slots: '2x M.2',
        sataPorts: 4,
        lan: 'Realtek 2.5GbE LAN',
        audio: 'Realtek ALC1200 codec',
      },
      fieldEvidence: {
        socket: { value: 'AM4', sourceUrl: 'https://www.gigabyte.com/Motherboard/B550-AORUS-ELITE-V2-rev-10/sp#sp', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2020-07-01', confidence: 100 },
      },
      officialSources: [
        { title: 'GIGABYTE B550 AORUS ELITE V2 Specs', url: 'https://www.gigabyte.com/Motherboard/B550-AORUS-ELITE-V2-rev-10/sp#sp', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2020-07-01' },
      ],
      cpuSupportList: [
        { cpuModel: 'AMD Ryzen 5 5600X', socket: 'AM4', sinceBiosVersion: 'F10', sourceUrl: 'https://www.gigabyte.com/Motherboard/B550-AORUS-ELITE-V2-rev-10/support#support-cpu', verifiedAt: '2020-11-05' },
        { cpuModel: 'AMD Ryzen 7 5700X3D', socket: 'AM4', sinceBiosVersion: 'F17b', sourceUrl: 'https://www.gigabyte.com/Motherboard/B550-AORUS-ELITE-V2-rev-10/support#support-cpu', verifiedAt: '2024-02-01' },
      ],
      lastVerifiedAt: '2024-05-10',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 149,
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
      activeModels: 1,
      legacyModels: 1,
      discontinuedModels: 0,
      recordsWithEvidence: this.records.length,
      unknownFieldsTotal: 0,
      lastIngestionAt: '2024-11-06T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}

// ============================================================================
// 4. ASROCK OFFICIAL SOURCE ADAPTER
// ============================================================================
export class AsrockSourceAdapter implements HardwareOfficialSourceAdapter {
  readonly sourceId = 'asrock-taichi-official';
  readonly manufacturer = 'ASRock';
  readonly executionMode = 'STATIC_SEED_DATA' as const;
  readonly officialDomains = ['asrock.com', 'asrock.com.tw'];
  readonly supportedCategories: SubsystemType[] = ['motherboard', 'gpu'];

  private records: MasterComponentRecord[] = [
    // MOTHERBOARD: ASROCK X870E TAICHI (AM5 Flagship)
    {
      id: 'asrock-x870e-taichi',
      category: 'motherboard',
      manufacturer: 'ASRock',
      family: 'Taichi',
      model: 'ASRock X870E Taichi',
      exactModel: 'X870E Taichi Motherboard',
      partNumber: 'X870E TAICHI',
      sku: 'X870E-TAICHI',
      kind: 'EXACT_SKU',
      lifecycle: 'CURRENT',
      status: 'CURRENT',
      releaseDate: '2024-09-30',
      specsSummary: 'Socket AM5 • AMD X870E • E-ATX • 4x DDR5 hasta 8200+(OC) MT/s • 4x M.2 (1x PCIe 5.0 x4 + 3x PCIe 4.0 x4) • Wi-Fi 7 + 5Gb Realtek LAN • Dual USB4 40Gbps • 24+2+1 VRM (110A SPS)',
      specifications: {
        socket: 'AM5',
        chipset: 'AMD X870E',
        formFactor: 'E-ATX',
        dimensionsMm: '305 x 267',
        memoryType: 'DDR5',
        memorySlots: 4,
        maxMemoryGb: 256,
        memorySpeeds: 'DDR5 8200+(OC)/ 6400/ 5600 MT/s',
        pcieSlots: '2x PCIe 5.0 x16 (x16 or x8/x8 mode)',
        m2Slots: '1x Blazing M.2 (PCIe 5.0 x4) + 3x Hyper M.2 (PCIe 4.0 x4)',
        sataPorts: 4,
        lan: 'Realtek 5GbE LAN',
        wifi: '802.11be Wi-Fi 7 Module + Bluetooth 5.4',
        audio: 'Realtek ALC4082 + ESS SABRE9218 DAC',
        vrmPhases: '24+2+1 Power Phases (110A Smart Power Stage)',
      },
      fieldEvidence: {
        socket: { value: 'AM5', sourceUrl: 'https://www.asrock.com/mb/AMD/X870E%20Taichi/index.asp#Specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-01', confidence: 100 },
        vrm: { value: '24+2+1 (110A)', sourceUrl: 'https://www.asrock.com/mb/AMD/X870E%20Taichi/index.asp#Specification', sourceType: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-01', confidence: 100 },
      },
      officialSources: [
        { title: 'ASRock X870E Taichi Official Specs', url: 'https://www.asrock.com/mb/AMD/X870E%20Taichi/index.asp#Specification', type: 'OFFICIAL_SPEC_PAGE', retrievedAt: '2024-10-01' },
      ],
      cpuSupportList: [
        { cpuModel: 'AMD Ryzen 7 9800X3D', socket: 'AM5', sinceBiosVersion: '3.08', sourceUrl: 'https://www.asrock.com/mb/AMD/X870E%20Taichi/index.asp#CPU', verifiedAt: '2024-11-06' },
      ],
      lastVerifiedAt: '2024-11-06',
      confidence: 100,
      unknownFields: [],
      estimatedPriceUsd: 449,
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
      lastIngestionAt: '2024-11-06T00:00:00.000Z',
      status: 'ONLINE',
    };
  }
}
