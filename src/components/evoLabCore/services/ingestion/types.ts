// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — MASTER HARDWARE DATA INGESTION V1
// Philosophy: "NO SE ADIVINA. EL FABRICANTE APORTA LA EVIDENCIA.
//              SI UN DATO NO PUEDE VERIFICARSE: UNKNOWN."
// ============================================================================

import {
  SubsystemType,
  EpistemicProvenance,
  HardwareGranularityKind,
  HardwareLifecycleState,
  DataVerificationStatus,
} from '../../types';

export type OfficialSourceType =
  | 'OFFICIAL_PRODUCT_PAGE'
  | 'OFFICIAL_DATASHEET'
  | 'CPU_SUPPORT_LIST'
  | 'BIOS_RELEASE_NOTES'
  | 'QVL_DOCUMENT'
  | 'MANUAL_PDF'
  | 'OFFICIAL_SPEC_PAGE'
  | 'GLOBAL_SUPPORT_PAGE';

export type AdapterExecutionMode =
  | 'LIVE_INGESTION'
  | 'STATIC_SEED_DATA'
  | 'PARTIAL_LIVE'
  | 'SOURCE_AUTOMATION_BLOCKED'
  | 'NOT_IMPLEMENTED';

export type CatalogProvenanceKind =
  | 'SEED'
  | 'LIVE_INGESTED'
  | 'USER_DISCOVERED'
  | 'USER_MANUAL';

export interface FieldEvidence<T = any> {
  value: T;
  sourceUrl: string;
  sourceType: OfficialSourceType;
  retrievedAt: string;
  confidence: number; // 0 - 100
  note?: string;
}

export interface CpuSupportEntry {
  cpuModel: string;
  cpuPartNumber?: string;
  socket: string;
  coreStepping?: string;
  sinceBiosVersion: string;
  biosReleaseDate?: string;
  validatedWattageTdp?: number;
  sourceUrl: string;
  verifiedAt: string;
}

export interface RamQvlEntry {
  vendor: string;
  partNumber: string;
  density: string; // ej: "16GB (2x8GB)"
  speedMts: number;
  timings: string; // ej: "16-18-18-38"
  voltageV: number;
  supportedSlots: 1 | 2 | 4;
  xmpExpoProfile?: 'XMP 2.0' | 'XMP 3.0' | 'EXPO' | 'JEDEC';
  sourceUrl: string;
}

export interface BiosReleaseEntry {
  version: string;
  releaseDate: string;
  agesaOrMicrocode?: string;
  description: string;
  checksum?: string;
  downloadUrl?: string;
  sourceUrl: string;
}

export interface MasterComponentRecord {
  id: string;
  category: SubsystemType;
  manufacturer: string;
  family: string;
  model: string;
  exactModel: string;
  variant?: string;
  partNumber?: string;
  sku?: string;
  revision?: string;
  kind: HardwareGranularityKind;
  lifecycle: HardwareLifecycleState;
  status: 'CURRENT' | 'LEGACY' | 'DISCONTINUED' | 'OEM' | 'UNKNOWN';
  provenanceKind?: CatalogProvenanceKind;
  releaseDate?: string;
  discontinued?: boolean;
  specsSummary: string;
  specifications: Record<string, any>;
  fieldEvidence: Record<string, FieldEvidence>;
  officialSources: {
    title: string;
    url: string;
    type: OfficialSourceType;
    retrievedAt: string;
  }[];
  cpuSupportList?: CpuSupportEntry[];
  ramQvlList?: RamQvlEntry[];
  biosReleases?: BiosReleaseEntry[];
  lastVerifiedAt: string;
  confidence: number;
  unknownFields: string[];
  estimatedPriceUsd?: number;
}

export interface IngestionBatchResult {
  sourceId: string;
  manufacturer: string;
  category: SubsystemType;
  executionMode?: AdapterExecutionMode;
  totalFound: number;
  modelsImported: MasterComponentRecord[];
  duplicatesDetected: number;
  unknownFieldsCount: number;
  failedItems: { rawInput: string; error: string }[];
  lastVerifiedAt: string;
}

export interface IngestionExecutionResult {
  sourceId: string;
  manufacturer: string;
  executionMode: AdapterExecutionMode;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  pagesVisited: number;
  familiesExplored: string[];
  productsDiscovered: number;
  productsParsed: number;
  productsInserted: number;
  productsUpdated: number;
  duplicatesSkipped: number;
  productsFailed: number;
  unknownFieldsRecorded: number;
  warnings: string[];
  errors: string[];
  evidencePayloadSizeKb?: number;
}

export interface SourceAdapterStats {
  sourceId: string;
  manufacturer: string;
  executionMode: AdapterExecutionMode;
  officialDomains: string[];
  categoriesSupported: SubsystemType[];
  totalRecords: number;
  activeModels: number;
  legacyModels: number;
  discontinuedModels: number;
  recordsWithEvidence: number;
  unknownFieldsTotal: number;
  pagesVisited?: number;
  lastIngestionAt: string;
  lastFailureAt?: string;
  lastExecutionResult?: IngestionExecutionResult;
  status: 'ONLINE' | 'STANDBY' | 'RATE_LIMITED' | 'OFFLINE';
  knownGaps?: string[];
}

export interface HardwareOfficialSourceAdapter {
  readonly sourceId: string;
  readonly manufacturer: string;
  readonly executionMode: AdapterExecutionMode;
  readonly officialDomains: string[];
  readonly supportedCategories: SubsystemType[];

  fetchCatalog(category: SubsystemType): Promise<IngestionBatchResult>;
  fetchComponentDetails(modelOrSku: string, category: SubsystemType): Promise<MasterComponentRecord | null>;
  runLiveIngestion?(category?: SubsystemType): Promise<IngestionExecutionResult>;
  fetchCpuSupportList?(motherboardModel: string): Promise<CpuSupportEntry[]>;
  fetchRamQvl?(motherboardModel: string): Promise<RamQvlEntry[]>;
  fetchBiosReleases?(motherboardModel: string): Promise<BiosReleaseEntry[]>;
  getStats(): SourceAdapterStats;
}
