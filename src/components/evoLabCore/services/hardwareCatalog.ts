// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — EXTENDED HARDWARE CATALOG & PROVIDER
// Architecture: HardwareCatalogProvider & Normalizer
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import {
  SubsystemType,
  EpistemicProvenance,
  BuildComponentItem,
  ComponentOwnershipState,
  HardwareGranularityKind,
  HardwareLifecycleState,
  DataVerificationStatus,
  SubsystemReplaceability,
} from '../types';
import { VERIFIED_HARDWARE_DATASET } from './hardwareCatalogData';
import { HardwareOfficialSourceRegistry } from './ingestion/hardwareOfficialSourceRegistry';

export interface HardwareComponent {
  id: string;
  manufacturer: string;
  family?: string;
  model: string;
  variant?: string;
  partNumber?: string;
  sku?: string;
  revision?: string;
  kind?: HardwareGranularityKind;
  lifecycle?: HardwareLifecycleState;
  category: SubsystemType;
  specsSummary: string;
  specifications: Record<string, any>;
  aliases: string[];
  sources: string[];
  officialUrl?: string;
  retrievedAt: string;
  confidence: number;
  status: 'VERIFIED' | 'COMMUNITY' | 'ESTIMATED';
  verificationStatus?: DataVerificationStatus;
  replaceability?: SubsystemReplaceability;
  conflictingSources?: { source: string; claim: string }[];
  estimatedPriceUsd?: number;
  isDiscovered?: boolean;
}

export interface CatalogCoverage {
  manufacturersCovered: string[];
  categoriesCovered: SubsystemType[];
  modelsIndexed: number;
  lastUpdate: string;
  missingFields: string[];
  knownGaps: string[];
}

export class HardwareNormalizer {
  /**
   * Cleans and normalizes commercial or vendor strings (e.g. "12th Gen Intel(R) Core(TM) i3-1220P" -> "Intel Core i3-1220P")
   */
  static normalizeModelName(rawInput: string): string {
    if (!rawInput) return '';
    let cleaned = rawInput.trim();

    // Strip trademarks, clock speeds, and extra Windows descriptor noise
    cleaned = cleaned
      .replace(/\(R\)|\(TM\)/gi, '')
      .replace(/@\s*[\d.]+\s*(GHz|MHz)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Handle "12th Gen Intel Core i3-1220P" -> "Intel Core i3-1220P"
    cleaned = cleaned.replace(/^\d+(?:st|nd|rd|th)\s+Gen\s+/i, '');

    // Standardize GPU names
    if (/5090/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/5090/i, 'GeForce RTX 5090');
    else if (/5080/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/5080/i, 'GeForce RTX 5080');
    else if (/5070/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/5070/i, 'GeForce RTX 5070');
    else if (/4090/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/4090/i, 'GeForce RTX 4090');
    else if (/4080/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/4080/i, 'GeForce RTX 4080');
    else if (/4070/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/4070/i, 'GeForce RTX 4070');
    else if (/4060/i.test(cleaned) && !/RTX/i.test(cleaned)) cleaned = cleaned.replace(/4060/i, 'GeForce RTX 4060');
    else if (/7800\s*xt/i.test(cleaned) && !/RX/i.test(cleaned)) cleaned = cleaned.replace(/7800\s*xt/i, 'Radeon RX 7800 XT');
    else if (/7600/i.test(cleaned) && !/RX/i.test(cleaned)) cleaned = cleaned.replace(/7600/i, 'Radeon RX 7600');

    // Standardize CPU names
    if (/7800x3d/i.test(cleaned) && !/Ryzen/i.test(cleaned)) cleaned = cleaned.replace(/7800x3d/i, 'AMD Ryzen 7 7800X3D');
    else if (/9800x3d/i.test(cleaned) && !/Ryzen/i.test(cleaned)) cleaned = cleaned.replace(/9800x3d/i, 'AMD Ryzen 7 9800X3D');
    else if (/14900k/i.test(cleaned) && !/Core/i.test(cleaned)) cleaned = cleaned.replace(/14900k/i, 'Intel Core i9-14900K');
    else if (/13400f/i.test(cleaned) && !/Core/i.test(cleaned)) cleaned = cleaned.replace(/13400f/i, 'Intel Core i5-13400F');
    else if (/1220p/i.test(cleaned) && !/Core/i.test(cleaned)) cleaned = cleaned.replace(/1220p/i, 'Intel Core i3-1220P');

    return cleaned;
  }

  /**
   * Generates a normalized signature for duplicate checking
   */
  static generateSignature(mfr: string, model: string, partNumber?: string, revision?: string): string {
    const cleanMfr = (mfr || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanModel = (model || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPart = (partNumber || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRev = (revision || 'rev1').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanMfr}:${cleanPart || cleanModel}:${cleanRev}`;
  }
}

export class HardwareCatalogProvider {
  private static localComponents: HardwareComponent[] = [...VERIFIED_HARDWARE_DATASET];

  private static STORAGE_KEY = 'evo_discovered_components_v1';

  /**
   * Load any user-discovered hardware from persistent storage
   */
  private static loadDiscovered(): HardwareComponent[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Returns all components (built-in verified + official registry + user-discovered)
   */
  static getAllComponents(): HardwareComponent[] {
    const discovered = this.loadDiscovered();
    const existingIds = new Set(this.localComponents.map((c) => c.id));
    const discoveredFiltered = discovered.filter((d) => !existingIds.has(d.id));
    return [...this.localComponents, ...discoveredFiltered];
  }

  static getComponentsByCategory(category: SubsystemType): HardwareComponent[] {
    return this.getAllComponents().filter((c) => c.category === category);
  }

  static findComponentById(id: string): HardwareComponent | undefined {
    return this.getAllComponents().find((c) => c.id === id);
  }

  /**
   * Checks if an incoming component already exists in the catalog (Duplicate Prevention)
   */
  static checkDuplicate(candidate: Partial<HardwareComponent>): HardwareComponent | undefined {
    const all = this.getAllComponents();
    if (candidate.id) {
      const byId = all.find((c) => c.id.toLowerCase() === candidate.id?.toLowerCase());
      if (byId) return byId;
    }

    const candidateSig = HardwareNormalizer.generateSignature(
      candidate.manufacturer || '',
      candidate.model || '',
      candidate.partNumber,
      candidate.revision
    );

    return all.find((c) => {
      const sig = HardwareNormalizer.generateSignature(
        c.manufacturer,
        c.model,
        c.partNumber,
        c.revision
      );
      return sig === candidateSig;
    });
  }

  /**
   * Searches the catalog by model name, aliases, manufacturer or part number
   */
  static searchComponents(query: string, category?: SubsystemType): HardwareComponent[] {
    const clean = query.trim().toLowerCase();
    if (!clean) return category ? this.getComponentsByCategory(category) : this.getAllComponents();

    return this.getAllComponents().filter((c) => {
      if (category && c.category !== category) return false;
      const matchModel = c.model.toLowerCase().includes(clean);
      const matchMfr = c.manufacturer.toLowerCase().includes(clean);
      const matchPart = c.partNumber?.toLowerCase().includes(clean) || false;
      const matchAliases = c.aliases.some((a) => a.toLowerCase().includes(clean));
      const matchSummary = c.specsSummary.toLowerCase().includes(clean);
      return matchModel || matchMfr || matchPart || matchAliases || matchSummary;
    });
  }

  /**
   * Incorporate a new verified component into the catalog with duplicate checking and persistence
   */
  static addComponent(component: HardwareComponent): HardwareComponent {
    const duplicate = this.checkDuplicate(component);
    if (duplicate) {
      // Return existing entry to avoid duplicating
      return duplicate;
    }

    const discovered = this.loadDiscovered();
    const existingIndex = discovered.findIndex((c) => c.id === component.id);

    const enriched: HardwareComponent = {
      ...component,
      isDiscovered: true,
      kind: component.kind || (component.partNumber ? 'EXACT_SKU' : 'BASE_MODEL'),
      lifecycle: component.lifecycle || 'CURRENT',
      verificationStatus: component.verificationStatus || 'MANUFACTURER_VERIFIED',
      retrievedAt: component.retrievedAt || new Date().toISOString(),
      status: component.status || 'VERIFIED',
    };

    if (existingIndex >= 0) {
      discovered[existingIndex] = enriched;
    } else {
      discovered.unshift(enriched);
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
    } catch (e) {
      console.warn('[EVO CATALOG] Failed to save discovered hardware to localStorage:', e);
    }

    // Dispatch event so any open view reactively refreshes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('evo_catalog_updated', {
          detail: { component: enriched },
        })
      );
    }

    return enriched;
  }

  /**
   * Converts a HardwareComponent to a BuildComponentItem for the Builder & Compatibility Engine
   */
  static toBuildItem(c: HardwareComponent, ownershipState: ComponentOwnershipState = 'SELECTED'): BuildComponentItem {
    return {
      id: c.id,
      subsystem: c.category,
      model: c.model,
      manufacturer: c.manufacturer,
      family: c.family,
      partNumber: c.partNumber,
      sku: c.partNumber || c.id,
      revision: c.revision,
      kind: c.kind || (c.partNumber ? 'EXACT_SKU' : 'BASE_MODEL'),
      lifecycle: c.lifecycle || 'CURRENT',
      specsSummary: c.specsSummary,
      specifications: c.specifications,
      estimatedPriceUsd: c.estimatedPriceUsd !== undefined ? c.estimatedPriceUsd : 120,
      ownershipState,
      verificationStatus: c.verificationStatus || (c.status === 'VERIFIED' ? 'MANUFACTURER_VERIFIED' : 'SECONDARY_VERIFIED'),
      replaceability: c.replaceability || 'REPLACEABLE',
      valueRating: 'BALANCED',
      valueRationale: `Componente verificado oficial (${c.sources[0] || c.manufacturer}). Incorporado al laboratorio.`,
      sources: c.sources,
      lastVerifiedAt: c.retrievedAt,
      variantRequiredForPhysicalCompatibility: c.kind === 'BASE_MODEL',
      conflictingSources: c.conflictingSources,
    };
  }

  /**
   * Returns BuildComponentItems for a given category (built-in + discovered)
   */
  static getBuildItemsByCategory(category: SubsystemType): BuildComponentItem[] {
    return this.getComponentsByCategory(category).map((c) => this.toBuildItem(c));
  }

  static getCatalogCoverage(): CatalogCoverage {
    const all = this.getAllComponents();
    const manufacturers = Array.from(new Set(all.map((c) => c.manufacturer)));
    const categories = Array.from(new Set(all.map((c) => c.category)));
    return {
      manufacturersCovered: manufacturers,
      categoriesCovered: categories,
      modelsIndexed: all.length,
      lastUpdate: new Date().toISOString().split('T')[0],
      missingFields: ['GPU Clearance in mm for Cases', 'Exact BIOS Release Version per Board Unit'],
      knownGaps: ['Laptop Motherboards and proprietary OEM chassis dimensions require manual measurement'],
    };
  }
}
