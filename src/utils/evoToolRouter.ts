import { getToolOwnerSection, getToolOwnershipEntry } from '../data/evoOwnershipMap';

export interface EvoToolRouterContext {
  setCurrentView: (view: any) => void;
  setCampusSection?: (section: any) => void;
  setActiveLabPanel?: (panel: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all') => void;
  setActiveLabMission?: (mission: 'IDLE' | 'REPAIR' | 'TEST' | 'BOTTLENECK' | 'OPTIMIZE' | 'UPGRADE') => void;
  setLabCorePhase?: (phase: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE') => void;
  setMatrixInitialScenario?: (scenario: string | undefined) => void;
  setShowDiscoveryModal?: (val: boolean) => void;
  setShowCoverageDashboard?: (val: boolean) => void;
  setShowIntegrityModal?: (val: boolean) => void;
  openCaseResolver?: () => void;
  openDigitalTwin?: () => void;
  openForensicReport?: () => void;
  openContentFactory?: () => void;
  openTransferChallenge?: () => void;
  openDossierModal?: (tomoId: string) => void;
  openLatencyCalculator?: () => void;
  openBuildArchitect?: () => void;
}

/**
 * CANONICAL ROUTER FOR ALL 34 TOOLS BY TOOL.ID
 * Ensures Public Website and Mundo EVO route identically to exact tool destinations.
 */
export function executeToolById(toolId: string | undefined | null, ctx: EvoToolRouterContext): boolean {
  if (!toolId || typeof toolId !== 'string') return false;
  
  // Resolve canonical owner metadata for navigation decision
  const ownership = getToolOwnershipEntry(toolId);
  const ownerSection = ownership.owner;

  switch (toolId) {
    // =========================================================================
    // 1. DIAGNOSTICAR (8 HERRAMIENTAS)
    // =========================================================================
    case 'diag-boot-seq':
      ctx.setCurrentView('boot-lab');
      return true;

    case 'diag-bsod-decoder':
      ctx.setCurrentView('bsod-repair-view');
      return true;

    case 'diag-incident-events':
      ctx.setCurrentView('windows-error-analyzer-view');
      return true;

    case 'diag-bottleneck-calc':
      ctx.setCurrentView('bottleneck-simulator-view');
      return true;

    case 'diag-autodetect-pc':
      if (ctx.setShowDiscoveryModal) {
        ctx.setShowDiscoveryModal(true);
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_autodetect'));
        }, 120);
      }
      return true;

    case 'diag-telemetry-integrity':
      if (ctx.setShowIntegrityModal) {
        ctx.setShowIntegrityModal(true);
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_integrity'));
        }, 120);
      }
      return true;

    case 'diag-atx-power-bench':
      if (ctx.setLabCorePhase) ctx.setLabCorePhase('SELECT_PC');
      if (ctx.setActiveLabMission) ctx.setActiveLabMission('REPAIR');
      ctx.setCurrentView('lab-core');
      return true;

    case 'diag-case-resolver':
      if (ctx.openCaseResolver) {
        ctx.openCaseResolver();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_case_resolver'));
        }, 120);
      }
      return true;

    // =========================================================================
    // 2. MEDIR (6 HERRAMIENTAS)
    // =========================================================================
    case 'med-latency-calc':
      if (ctx.openLatencyCalculator) {
        ctx.openLatencyCalculator();
      } else {
        if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('hardware');
        ctx.setCurrentView('hotswap-lab');
      }
      return true;

    case 'med-frametime-analyzer':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('telemetry');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'med-sensors-telemetry':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('telemetry');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'med-dpc-latency':
      if (ctx.setMatrixInitialScenario) ctx.setMatrixInitialScenario('services');
      ctx.setCurrentView('windows-matrix-lab');
      return true;

    case 'med-stress-stability':
      if (ctx.setLabCorePhase) ctx.setLabCorePhase('SELECT_PC');
      if (ctx.setActiveLabMission) ctx.setActiveLabMission('TEST');
      ctx.setCurrentView('lab-core');
      return true;

    case 'med-thermal-history':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('telemetry');
      ctx.setCurrentView('hotswap-lab');
      return true;

    // =========================================================================
    // 3. INVESTIGAR (6 HERRAMIENTAS)
    // =========================================================================
    case 'inv-pcb-schematic':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('hardware');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'inv-xray-kernel':
      if (ctx.setMatrixInitialScenario) ctx.setMatrixInitialScenario('xray');
      ctx.setCurrentView('windows-xray-lab');
      return true;

    case 'inv-cache-imc-flow':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('hardware');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'inv-digital-twin':
      if (ctx.openDigitalTwin) {
        ctx.openDigitalTwin();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_digital_twin'));
        }, 120);
      }
      return true;

    case 'inv-workstations-sectors':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('all');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'inv-coverage-matrix':
      if (ctx.setShowCoverageDashboard) {
        ctx.setShowCoverageDashboard(true);
      } else {
        ctx.setCurrentView('lab-core');
      }
      return true;

    // =========================================================================
    // 4. REPARAR (4 HERRAMIENTAS)
    // =========================================================================
    case 'rep-windows-repair':
      if (ctx.setMatrixInitialScenario) ctx.setMatrixInitialScenario('repair');
      ctx.setCurrentView('windows-matrix-lab');
      return true;

    case 'rep-windows-install':
      if (ctx.setMatrixInitialScenario) ctx.setMatrixInitialScenario('install');
      ctx.setCurrentView('windows-matrix-lab');
      return true;

    case 'rep-hotswap-bench':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('sandbox');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'rep-core-repair-view':
      if (ctx.setLabCorePhase) ctx.setLabCorePhase('SELECT_PC');
      if (ctx.setActiveLabMission) ctx.setActiveLabMission('REPAIR');
      ctx.setCurrentView('lab-core');
      return true;

    // =========================================================================
    // 5. OPTIMIZAR (5 HERRAMIENTAS)
    // =========================================================================
    case 'opt-nt-services':
      if (ctx.setMatrixInitialScenario) ctx.setMatrixInitialScenario('services');
      ctx.setCurrentView('windows-matrix-lab');
      return true;

    case 'opt-core-optimization':
      if (ctx.setLabCorePhase) ctx.setLabCorePhase('SELECT_PC');
      if (ctx.setActiveLabMission) ctx.setActiveLabMission('OPTIMIZE');
      ctx.setCurrentView('lab-core');
      return true;

    case 'opt-ab-comparison':
      if (ctx.setActiveLabPanel) ctx.setActiveLabPanel('sandbox');
      ctx.setCurrentView('hotswap-lab');
      return true;

    case 'opt-upgrade-simulator':
      if (ctx.setLabCorePhase) ctx.setLabCorePhase('SELECT_PC');
      if (ctx.setActiveLabMission) ctx.setActiveLabMission('UPGRADE');
      ctx.setCurrentView('lab-core');
      return true;

    case 'opt-build-architect':
      if (ctx.openBuildArchitect) {
        ctx.openBuildArchitect();
      } else {
        if (ctx.setLabCorePhase) ctx.setLabCorePhase('BUILD_PC');
        ctx.setCurrentView('lab-core');
      }
      return true;

    // =========================================================================
    // 6. DOCUMENTAR (5 HERRAMIENTAS)
    // =========================================================================
    case 'doc-forensic-dossier':
      if (ctx.openForensicReport) {
        ctx.openForensicReport();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_forensic_report'));
        }, 120);
      }
      return true;

    case 'doc-evidence-passport':
      if (ctx.setShowDiscoveryModal) {
        ctx.setShowDiscoveryModal(true);
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('progreso');
      }
      return true;

    case 'doc-technical-dossier':
      if (ctx.openForensicReport) {
        ctx.openForensicReport();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_forensic_report'));
        }, 120);
      }
      return true;

    case 'doc-content-factory':
      if (ctx.openContentFactory) {
        ctx.openContentFactory();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_content_factory'));
        }, 120);
      }
      return true;

    case 'doc-transfer-challenge':
      if (ctx.openTransferChallenge) {
        ctx.openTransferChallenge();
      } else {
        ctx.setCurrentView('world-map');
        if (ctx.setCampusSection) ctx.setCampusSection('diagnosticar');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evo_open_transfer_challenge'));
        }, 120);
      }
      return true;

    default:
      ctx.setCurrentView('world-map');
      if (ctx.setCampusSection) ctx.setCampusSection('herramientas');
      return false;
  }
}

/**
 * CANONICAL ROUTER FOR THE 10 TOMOS BY ID
 * Strictly opens readers only for Tomos with FULL_READER status (01, 02, 03, 04, 08).
 * Never falls back to Tomo 01 for invalid or unreadable tomos.
 */
export function executeTomoById(
  tomeId: string | undefined | null,
  ctx: {
    setCurrentView: (view: any) => void;
    openDossierModal?: (tomoId: string) => void;
  }
): boolean {
  if (!tomeId || typeof tomeId !== 'string') return false;
  const cleanId = tomeId.replace('tomo-', '').padStart(2, '0');

  switch (cleanId) {
    case '01':
      ctx.setCurrentView('cover');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '02':
      ctx.setCurrentView('tomo-02');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '03':
      ctx.setCurrentView('tomo-03');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '04':
      ctx.setCurrentView('tomo-04');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '05':
      ctx.setCurrentView('tomo-05');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '06':
      ctx.setCurrentView('tomo-06');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '07':
      ctx.setCurrentView('tomo-07');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '08':
      ctx.setCurrentView('tomo-08');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '09':
      ctx.setCurrentView('tomo-09');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '10':
      ctx.setCurrentView('tomo-10');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '11':
      ctx.setCurrentView('tomo-11');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    case '12':
      ctx.setCurrentView('tomo-12');
      try { window.scrollTo(0, 0); } catch {}
      return true;

    default:
      // ZERO FALLBACK TO TOMO 01! Do NOT navigate to cover or 01.
      return false;
  }
}
