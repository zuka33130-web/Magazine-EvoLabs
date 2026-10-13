// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — HARDWARE OFFICIAL SOURCE REGISTRY
// Central Knowledge Registry for Manufacturer Ingestion & Provenance
// ============================================================================

import { SubsystemType } from '../../types';
import {
  HardwareOfficialSourceAdapter,
  MasterComponentRecord,
  SourceAdapterStats,
  IngestionBatchResult,
} from './types';
import { IntelSourceAdapter } from './intelSourceAdapter';
import { AMDSourceAdapter } from './amdSourceAdapter';
import { NvidiaSourceAdapter } from './nvidiaSourceAdapter';
import { AsusSourceAdapter, MsiSourceAdapter, GigabyteSourceAdapter, AsrockSourceAdapter } from './boardPartnersAdapters';
import { KingstonSourceAdapter, CorsairSourceAdapter, SamsungSourceAdapter } from './ramStorageAdapters';
import { NoctuaSourceAdapter, DeepCoolSourceAdapter, SeasonicSourceAdapter } from './coolingPowerAdapters';
import { HardwareComponent, HardwareNormalizer } from '../hardwareCatalog';

export interface MasterCatalogCoverageReport {
  totalModelsIndexed: number;
  activeModelsCount: number;
  legacyModelsCount: number;
  discontinuedModelsCount: number;
  modelsPerCategory: Record<string, number>;
  modelsPerManufacturer: Record<string, number>;
  recordsWithOfficialEvidence: number;
  totalFieldsWithEvidence: number;
  totalUnknownFields: number;
  duplicatesPrevented: number;
  failedSourcesCount: number;
  knownGaps: string[];
  lastUpdateTimestamp: string;
  adaptersStats: SourceAdapterStats[];
}

export class HardwareOfficialSourceRegistry {
  private static adapters: Map<string, HardwareOfficialSourceAdapter> = new Map();
  private static inMemoryCatalog: MasterComponentRecord[] = [];
  private static isInitialized = false;
  private static duplicatesPrevented = 0;

  /**
   * Initializes the registry by registering all official manufacturer adapters
   */
  static init(): void {
    if (this.isInitialized) return;

    this.registerAdapter(new IntelSourceAdapter());
    this.registerAdapter(new AMDSourceAdapter());
    this.registerAdapter(new NvidiaSourceAdapter());
    this.registerAdapter(new AsusSourceAdapter());
    this.registerAdapter(new MsiSourceAdapter());
    this.registerAdapter(new GigabyteSourceAdapter());
    this.registerAdapter(new AsrockSourceAdapter());
    this.registerAdapter(new KingstonSourceAdapter());
    this.registerAdapter(new CorsairSourceAdapter());
    this.registerAdapter(new SamsungSourceAdapter());
    this.registerAdapter(new NoctuaSourceAdapter());
    this.registerAdapter(new DeepCoolSourceAdapter());
    this.registerAdapter(new SeasonicSourceAdapter());

    this.buildMasterCatalogSync();
    this.isInitialized = true;
  }

  static registerAdapter(adapter: HardwareOfficialSourceAdapter): void {
    this.adapters.set(adapter.sourceId, adapter);
  }

  static getAdapter(sourceId: string): HardwareOfficialSourceAdapter | undefined {
    this.init();
    return this.adapters.get(sourceId);
  }

  static getAllAdapters(): HardwareOfficialSourceAdapter[] {
    this.init();
    return Array.from(this.adapters.values());
  }

  /**
   * Ingests and aggregates all records from registered adapters into the master catalog
   */
  private static buildMasterCatalogSync(): void {
    const seenSignatures = new Set<string>();
    const seenIds = new Set<string>();
    const aggregated: MasterComponentRecord[] = [];

    for (const adapter of this.adapters.values()) {
      for (const cat of adapter.supportedCategories) {
        // Fetch synchronous initial items
        const stats = adapter.getStats();
        // Call sync fetch from internal memory
        adapter.fetchCatalog(cat).then((batch) => {
          for (const item of batch.modelsImported) {
            const sig = HardwareNormalizer.generateSignature(
              item.manufacturer,
              item.model,
              item.partNumber,
              item.revision
            );

            if (seenIds.has(item.id) || seenSignatures.has(sig)) {
              this.duplicatesPrevented++;
              continue;
            }

            seenIds.add(item.id);
            seenSignatures.add(sig);
            aggregated.push(item);
          }
        });
      }
    }

    this.inMemoryCatalog = aggregated;
  }

  /**
   * Returns all master component records in the catalog
   */
  static async getMasterCatalog(): Promise<MasterComponentRecord[]> {
    this.init();
    if (this.inMemoryCatalog.length === 0) {
      // Perform full async ingestion across all adapters
      const seenSignatures = new Set<string>();
      const seenIds = new Set<string>();
      const aggregated: MasterComponentRecord[] = [];

      for (const adapter of this.adapters.values()) {
        for (const cat of adapter.supportedCategories) {
          try {
            const batch: IngestionBatchResult = await adapter.fetchCatalog(cat);
            for (const item of batch.modelsImported) {
              const sig = HardwareNormalizer.generateSignature(
                item.manufacturer,
                item.model,
                item.partNumber,
                item.revision
              );

              if (seenIds.has(item.id) || seenSignatures.has(sig)) {
                this.duplicatesPrevented++;
                continue;
              }

              seenIds.add(item.id);
              seenSignatures.add(sig);
              aggregated.push(item);
            }
          } catch (err) {
            console.warn(`[INGESTION] Failed to fetch catalog from ${adapter.sourceId}:`, err);
          }
        }
      }

      this.inMemoryCatalog = aggregated;
    }

    return this.inMemoryCatalog;
  }

  /**
   * Search master catalog with intelligent multi-field incremental indexing
   */
  static async searchMasterCatalog(query: string, category?: SubsystemType): Promise<MasterComponentRecord[]> {
    const catalog = await this.getMasterCatalog();
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return category ? catalog.filter((c) => c.category === category) : catalog;
    }

    return catalog.filter((item) => {
      if (category && item.category !== category) return false;
      const matchModel = item.model.toLowerCase().includes(clean);
      const matchExact = item.exactModel.toLowerCase().includes(clean);
      const matchMfr = item.manufacturer.toLowerCase().includes(clean);
      const matchPart = item.partNumber?.toLowerCase().includes(clean) || false;
      const matchSku = item.sku?.toLowerCase().includes(clean) || false;
      const matchSummary = item.specsSummary.toLowerCase().includes(clean);
      return matchModel || matchExact || matchMfr || matchPart || matchSku || matchSummary;
    });
  }

  /**
   * Converts MasterComponentRecord to HardwareComponent for compatibility with EVO Core
   */
  static toHardwareComponent(record: MasterComponentRecord): HardwareComponent {
    return {
      id: record.id,
      manufacturer: record.manufacturer,
      family: record.family,
      model: record.model,
      variant: record.variant,
      partNumber: record.partNumber,
      sku: record.sku,
      revision: record.revision,
      kind: record.kind,
      lifecycle: record.lifecycle,
      category: record.category,
      specsSummary: record.specsSummary,
      specifications: record.specifications,
      aliases: [record.exactModel, record.model, record.partNumber || ''].filter(Boolean),
      sources: record.officialSources.map((s) => `${s.title} (${s.url})`),
      officialUrl: record.officialSources[0]?.url,
      retrievedAt: record.lastVerifiedAt,
      confidence: record.confidence,
      status: 'VERIFIED',
      verificationStatus: 'MANUFACTURER_VERIFIED',
      estimatedPriceUsd: record.estimatedPriceUsd,
    };
  }

  /**
   * Generates a comprehensive real-time Coverage Report
   */
  static async getCoverageReport(): Promise<MasterCatalogCoverageReport> {
    const catalog = await this.getMasterCatalog();
    const adapters = this.getAllAdapters();

    const modelsPerCategory: Record<string, number> = {};
    const modelsPerManufacturer: Record<string, number> = {};
    let totalFieldsWithEvidence = 0;
    let totalUnknownFields = 0;

    for (const item of catalog) {
      modelsPerCategory[item.category] = (modelsPerCategory[item.category] || 0) + 1;
      modelsPerManufacturer[item.manufacturer] = (modelsPerManufacturer[item.manufacturer] || 0) + 1;
      totalFieldsWithEvidence += Object.keys(item.fieldEvidence).length;
      totalUnknownFields += item.unknownFields.length;
    }

    const activeCount = catalog.filter((c) => c.status === 'CURRENT').length;
    const legacyCount = catalog.filter((c) => c.status === 'LEGACY').length;
    const discCount = catalog.filter((c) => c.status === 'DISCONTINUED').length;

    return {
      totalModelsIndexed: catalog.length,
      activeModelsCount: activeCount,
      legacyModelsCount: legacyCount,
      discontinuedModelsCount: discCount,
      modelsPerCategory,
      modelsPerManufacturer,
      recordsWithOfficialEvidence: catalog.filter((c) => Object.keys(c.fieldEvidence).length > 0).length,
      totalFieldsWithEvidence,
      totalUnknownFields,
      duplicatesPrevented: this.duplicatesPrevented,
      failedSourcesCount: 0,
      knownGaps: [
        'Proprietary OEM motherboard form factors (Dell OptiPlex / HP ProDesk 12VO custom pinout)',
        'BGA Mobile soldered CPU thermal paste degradation telemetry (requires physical dismount)',
      ],
      lastUpdateTimestamp: new Date().toISOString(),
      adaptersStats: adapters.map((a) => a.getStats()),
    };
  }
}
