// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — MASTER HARDWARE CATALOG STORAGE & INDEX ENGINE
// Decoupled Storage Layer for Hundreds of Thousands of Records with Multi-Key Indexing
// Principle: "SEPARAR CATALOG MASTER DATA DE USER MACHINE DATA.
//              NO RECORRER LINEALMENTE EL CATÁLOGO."
// ============================================================================

import { SubsystemType } from '../../types';
import {
  MasterComponentRecord,
  CatalogProvenanceKind,
} from './types';
import { HardwareNormalizer } from '../hardwareCatalog';

export interface CatalogSearchFilters {
  category?: SubsystemType;
  manufacturer?: string;
  socket?: string;
  chipset?: string;
  ddr?: 'DDR4' | 'DDR5';
  formFactor?: string;
  provenanceKind?: CatalogProvenanceKind;
  onlyCompatibleWith?: {
    socket?: string;
    ramType?: 'DDR4' | 'DDR5';
    maxGpuLengthMm?: number;
    maxCoolerHeightMm?: number;
  };
}

export class MasterHardwareCatalogStorage {
  private static STORAGE_KEY_LIVE = 'evo_master_live_ingested_v1';
  private static STORAGE_KEY_DISCOVERED = 'evo_discovered_components_v1';
  private static STORAGE_KEY_MANUAL = 'evo_master_user_manual_v1';

  // Primary in-memory record stores
  private static seedStore: Map<string, MasterComponentRecord> = new Map();
  private static liveStore: Map<string, MasterComponentRecord> = new Map();
  private static discoveredStore: Map<string, MasterComponentRecord> = new Map();
  private static manualStore: Map<string, MasterComponentRecord> = new Map();

  // Multi-Key Hash Indexes for O(1)/O(log N) lookup
  private static indexByManufacturer: Map<string, Set<string>> = new Map();
  private static indexByCategory: Map<string, Set<string>> = new Map();
  private static indexBySocket: Map<string, Set<string>> = new Map();
  private static indexByChipset: Map<string, Set<string>> = new Map();
  private static indexByDdr: Map<string, Set<string>> = new Map();
  private static indexByFormFactor: Map<string, Set<string>> = new Map();
  private static indexByPartNumber: Map<string, string> = new Map(); // PN -> ID
  private static indexByExactModel: Map<string, string> = new Map(); // Exact model -> ID
  private static signatureIndex: Map<string, string> = new Map(); // Signature -> ID

  private static isInitialized = false;

  static init(): void {
    if (this.isInitialized) return;
    this.loadFromPersistence();
    this.isInitialized = true;
  }

  /**
   * Registers seed catalog items (verified base fixtures)
   */
  static registerSeedRecords(records: MasterComponentRecord[]): void {
    for (const r of records) {
      const copy: MasterComponentRecord = { ...r, provenanceKind: 'SEED' };
      this.seedStore.set(copy.id, copy);
      this.indexRecord(copy);
    }
  }

  /**
   * Loads persisted live-ingested, discovered and manual records from storage
   */
  private static loadFromPersistence(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      // 1. Live Ingested
      const rawLive = localStorage.getItem(this.STORAGE_KEY_LIVE);
      if (rawLive) {
        const parsed: MasterComponentRecord[] = JSON.parse(rawLive);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            this.liveStore.set(r.id, r);
            this.indexRecord(r);
          }
        }
      }

      // 2. Discovered
      const rawDisc = localStorage.getItem(this.STORAGE_KEY_DISCOVERED);
      if (rawDisc) {
        const parsed: any[] = JSON.parse(rawDisc);
        if (Array.isArray(parsed)) {
          for (const d of parsed) {
            const asMaster: MasterComponentRecord = {
              id: d.id,
              category: d.category,
              manufacturer: d.manufacturer || 'Desconocido',
              family: d.family || '',
              model: d.model,
              exactModel: d.model,
              variant: d.variant,
              partNumber: d.partNumber,
              sku: d.sku || d.partNumber,
              revision: d.revision,
              kind: d.kind || 'EXACT_SKU',
              lifecycle: d.lifecycle || 'CURRENT',
              status: d.status === 'VERIFIED' ? 'CURRENT' : 'UNKNOWN',
              provenanceKind: 'USER_DISCOVERED',
              specsSummary: d.specsSummary,
              specifications: d.specifications || {},
              fieldEvidence: {},
              officialSources: (d.sources || []).map((s: string) => ({
                title: 'Official Discovery',
                url: d.officialUrl || '',
                type: 'OFFICIAL_PRODUCT_PAGE',
                retrievedAt: d.retrievedAt || new Date().toISOString(),
              })),
              lastVerifiedAt: d.retrievedAt || new Date().toISOString(),
              confidence: d.confidence || 90,
              unknownFields: [],
            };
            this.discoveredStore.set(asMaster.id, asMaster);
            this.indexRecord(asMaster);
          }
        }
      }

      // 3. User Manual
      const rawManual = localStorage.getItem(this.STORAGE_KEY_MANUAL);
      if (rawManual) {
        const parsed: MasterComponentRecord[] = JSON.parse(rawManual);
        if (Array.isArray(parsed)) {
          for (const m of parsed) {
            this.manualStore.set(m.id, m);
            this.indexRecord(m);
          }
        }
      }
    } catch (err) {
      console.warn('[MASTER STORAGE] Error loading persisted catalog:', err);
    }
  }

  /**
   * Persists live ingested store
   */
  private static saveLiveStore(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const list = Array.from(this.liveStore.values());
      localStorage.setItem(this.STORAGE_KEY_LIVE, JSON.stringify(list));
    } catch (err) {
      console.warn('[MASTER STORAGE] Failed to persist live ingested records:', err);
    }
  }

  /**
   * Adds or updates index entries for a given record
   */
  private static indexRecord(r: MasterComponentRecord): void {
    // 1. Manufacturer index
    const mfrKey = r.manufacturer.trim().toUpperCase();
    if (!this.indexByManufacturer.has(mfrKey)) this.indexByManufacturer.set(mfrKey, new Set());
    this.indexByManufacturer.get(mfrKey)!.add(r.id);

    // 2. Category index
    if (!this.indexByCategory.has(r.category)) this.indexByCategory.set(r.category, new Set());
    this.indexByCategory.get(r.category)!.add(r.id);

    // 3. Socket index
    const socket = (r.specifications?.socket || this.extractTag(r.specsSummary, /Socket\s*:\s*([\w\d-]+)/i))?.toUpperCase();
    if (socket) {
      if (!this.indexBySocket.has(socket)) this.indexBySocket.set(socket, new Set());
      this.indexBySocket.get(socket)!.add(r.id);
    }

    // 4. Chipset index
    const chipset = (r.specifications?.chipset || this.extractTag(r.specsSummary, /Chipset\s*:\s*([\w\d-]+)/i))?.toUpperCase();
    if (chipset) {
      if (!this.indexByChipset.has(chipset)) this.indexByChipset.set(chipset, new Set());
      this.indexByChipset.get(chipset)!.add(r.id);
    }

    // 5. DDR Generation index
    const ddr = r.specifications?.ramType || r.specifications?.ddrGeneration || (r.specsSummary.includes('DDR5') ? 'DDR5' : r.specsSummary.includes('DDR4') ? 'DDR4' : undefined);
    if (ddr) {
      const ddrKey = ddr.toUpperCase();
      if (!this.indexByDdr.has(ddrKey)) this.indexByDdr.set(ddrKey, new Set());
      this.indexByDdr.get(ddrKey)!.add(r.id);
    }

    // 6. Form Factor index
    const ff = (r.specifications?.formFactor || this.extractTag(r.specsSummary, /\b(ATX|Micro-ATX|Mini-ITX|E-ATX)\b/i))?.toUpperCase();
    if (ff) {
      if (!this.indexByFormFactor.has(ff)) this.indexByFormFactor.set(ff, new Set());
      this.indexByFormFactor.get(ff)!.add(r.id);
    }

    // 7. Part Number & Exact Model direct index
    if (r.partNumber) {
      this.indexByPartNumber.set(r.partNumber.trim().toUpperCase(), r.id);
    }
    this.indexByExactModel.set(r.exactModel.trim().toUpperCase(), r.id);

    // 8. Normalizer signature index
    const sig = HardwareNormalizer.generateSignature(r.manufacturer, r.model, r.partNumber, r.revision);
    this.signatureIndex.set(sig, r.id);
  }

  /**
   * Inserts or updates a single record
   */
  static insertOrUpdate(record: MasterComponentRecord): { inserted: boolean; updated: boolean } {
    this.init();

    // Check duplicate by signature
    const sig = HardwareNormalizer.generateSignature(record.manufacturer, record.model, record.partNumber, record.revision);
    const existingId = this.signatureIndex.get(sig) || (record.partNumber && this.indexByPartNumber.get(record.partNumber.toUpperCase()));

    let targetStore: Map<string, MasterComponentRecord>;
    if (record.provenanceKind === 'SEED') targetStore = this.seedStore;
    else if (record.provenanceKind === 'LIVE_INGESTED') targetStore = this.liveStore;
    else if (record.provenanceKind === 'USER_DISCOVERED') targetStore = this.discoveredStore;
    else targetStore = this.manualStore;

    if (existingId) {
      targetStore.set(existingId, { ...record, id: existingId });
      this.indexRecord(record);
      if (record.provenanceKind === 'LIVE_INGESTED') this.saveLiveStore();
      return { inserted: false, updated: true };
    }

    targetStore.set(record.id, record);
    this.indexRecord(record);
    if (record.provenanceKind === 'LIVE_INGESTED') this.saveLiveStore();
    return { inserted: true, updated: false };
  }

  /**
   * Batch insert records from live collectors or admin imports
   */
  static insertBatch(records: MasterComponentRecord[]): { inserted: number; updated: number; duplicates: number } {
    this.init();
    let inserted = 0;
    let updated = 0;
    let duplicates = 0;

    for (const r of records) {
      const res = this.insertOrUpdate(r);
      if (res.inserted) inserted++;
      else if (res.updated) updated++;
      else duplicates++;
    }

    this.saveLiveStore();
    return { inserted, updated, duplicates };
  }

  /**
   * Retrieves a record by ID across all stores
   */
  static getById(id: string): MasterComponentRecord | undefined {
    this.init();
    return this.liveStore.get(id) || this.seedStore.get(id) || this.discoveredStore.get(id) || this.manualStore.get(id);
  }

  /**
   * Retrieves a record by exact Part Number
   */
  static getByPartNumber(partNumber: string): MasterComponentRecord | undefined {
    this.init();
    const id = this.indexByPartNumber.get(partNumber.trim().toUpperCase());
    return id ? this.getById(id) : undefined;
  }

  /**
   * Returns all records aggregated across all stores
   */
  static getAllRecords(): MasterComponentRecord[] {
    this.init();
    const all: MasterComponentRecord[] = [];
    const seen = new Set<string>();

    // Priority: Live Ingested > Discovered > Manual > Seed
    for (const r of this.liveStore.values()) {
      seen.add(r.id);
      all.push(r);
    }
    for (const r of this.discoveredStore.values()) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        all.push(r);
      }
    }
    for (const r of this.manualStore.values()) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        all.push(r);
      }
    }
    for (const r of this.seedStore.values()) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        all.push(r);
      }
    }

    return all;
  }

  /**
   * Search with fast multi-index filtering
   */
  static search(query: string, filters?: CatalogSearchFilters): MasterComponentRecord[] {
    this.init();
    let candidateIds: Set<string> | null = null;

    // 1. Filter by category index
    if (filters?.category) {
      const catSet = this.indexByCategory.get(filters.category);
      candidateIds = catSet ? new Set(catSet) : new Set();
    }

    // 2. Filter by manufacturer index
    if (filters?.manufacturer) {
      const mfrSet = this.indexByManufacturer.get(filters.manufacturer.toUpperCase());
      if (mfrSet) {
        candidateIds = candidateIds ? new Set([...candidateIds].filter((id) => mfrSet.has(id))) : new Set(mfrSet);
      } else {
        return [];
      }
    }

    // 3. Filter by socket index
    const targetSocket = filters?.socket || filters?.onlyCompatibleWith?.socket;
    if (targetSocket) {
      const sockSet = this.indexBySocket.get(targetSocket.toUpperCase());
      if (sockSet) {
        candidateIds = candidateIds ? new Set([...candidateIds].filter((id) => sockSet.has(id))) : new Set(sockSet);
      } else if (filters?.category === 'motherboard' || filters?.category === 'cpu') {
        // Strict socket requirement
        return [];
      }
    }

    // 4. Filter by DDR index
    const targetDdr = filters?.ddr || filters?.onlyCompatibleWith?.ramType;
    if (targetDdr) {
      const ddrSet = this.indexByDdr.get(targetDdr.toUpperCase());
      if (ddrSet) {
        candidateIds = candidateIds ? new Set([...candidateIds].filter((id) => ddrSet.has(id))) : new Set(ddrSet);
      }
    }

    // Resolve candidates
    let records: MasterComponentRecord[];
    if (candidateIds !== null) {
      records = Array.from(candidateIds)
        .map((id) => this.getById(id))
        .filter((r): r is MasterComponentRecord => r !== undefined);
    } else {
      records = this.getAllRecords();
    }

    // Text search if query provided
    const clean = query.trim().toLowerCase();
    if (clean) {
      records = records.filter(
        (r) =>
          r.model.toLowerCase().includes(clean) ||
          r.exactModel.toLowerCase().includes(clean) ||
          r.manufacturer.toLowerCase().includes(clean) ||
          (r.partNumber && r.partNumber.toLowerCase().includes(clean)) ||
          r.specsSummary.toLowerCase().includes(clean)
      );
    }

    return records;
  }

  /**
   * Returns exact provenance counts
   */
  static getProvenanceCounts(): {
    seed: number;
    liveIngested: number;
    userDiscovered: number;
    userManual: number;
    total: number;
  } {
    this.init();
    const all = this.getAllRecords();
    return {
      seed: all.filter((r) => r.provenanceKind === 'SEED').length,
      liveIngested: all.filter((r) => r.provenanceKind === 'LIVE_INGESTED').length,
      userDiscovered: all.filter((r) => r.provenanceKind === 'USER_DISCOVERED').length,
      userManual: all.filter((r) => r.provenanceKind === 'USER_MANUAL').length,
      total: all.length,
    };
  }

  private static extractTag(str: string, regex: RegExp): string | undefined {
    const match = str.match(regex);
    return match ? match[1] : undefined;
  }
}
