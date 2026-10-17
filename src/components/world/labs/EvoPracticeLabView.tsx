import React from 'react';
import { CanonicalPracticeLab } from '../../../data/evoCatalog';
import { UserHardwarePassport } from '../../../types';
import { EvoLabConsole } from './EvoLabConsole';

const Network = React.lazy(() => import('../../labs/tomo05/EvoNetworkForensicsLab').then((m) => ({ default: m.EvoNetworkForensicsLab })));
const Security = React.lazy(() => import('../../labs/tomo06/EvoDefensiveSecurityLab').then((m) => ({ default: m.EvoDefensiveSecurityLab })));
const Performance = React.lazy(() => import('../../labs/tomo07/EvoPerformanceMetrologyLab').then((m) => ({ default: m.EvoPerformanceMetrologyLab })));
const Code = React.lazy(() => import('../../labs/tomo09/EvoCodeEngineeringLab').then((m) => ({ default: m.EvoCodeEngineeringLab })));
const Ai = React.lazy(() => import('../../labs/tomo10/EvoAiSystemsLab').then((m) => ({ default: m.EvoAiSystemsLab })));
const Electronics = React.lazy(() => import('../../tomo11/Tomo11MasterPage').then((m) => ({ default: m.Tomo11MasterPage })));
const Game = React.lazy(() => import('../../game-forge/GameForgeStudio').then((m) => ({ default: m.GameForgeStudio })));
const Sector01 = React.lazy(() => import('../../tomo02/sector01/Tomo02Sector01LabModal').then((m) => ({ default: m.Tomo02Sector01LabModal })));
const Pcb = React.lazy(() => import('../EvoMotherboardCanvas'));
const LiveBench = React.lazy(() => import('../EvoLiveBenchSuite').then((m) => ({ default: m.EvoLiveBenchSuite })));

interface Props {
  lab: CanonicalPracticeLab;
  passport: UserHardwarePassport | null;
  onBack: () => void;
  onOpenTomo: (tomo: string) => void;
}

/** Navigation adapter only: every experiment uses its original component. */
export const EvoPracticeLabView: React.FC<Props> = ({ lab, passport, onBack, onOpenTomo }) => {
  const target = lab.target;
  let content: React.ReactNode;
  if (target?.type === 'campus') {
    content = <EvoLabConsole initialZoneId={target.zone} passport={passport} onBackToMap={onBack}
      onEnterTomo01={() => onOpenTomo('01')} onEnterMagazine={() => onOpenTomo('01')}
      onEnterTomo02={() => onOpenTomo('02')} onEnterTomo03={() => onOpenTomo('03')}
      onEnterTomo04={() => onOpenTomo('04')} onOpenTomo={onOpenTomo} />;
  } else if (target?.type === 'embedded') {
    switch (target.engine) {
      case 'network': content = <Network initialSubLabId={target.module} onClose={onBack} />; break;
      case 'security': content = <Security initialSubLabId={target.module} onClose={onBack} />; break;
      case 'performance': content = <Performance initialSubLabId={target.module} onClose={onBack} />; break;
      case 'code': content = <Code initialSubLabId={target.module} onClose={onBack} />; break;
      case 'ai': content = <Ai initialSubLabId={target.module} onClose={onBack} />; break;
      case 'electronics': content = <Electronics initialLabTab={target.tab} onCloseLab={onBack} onBack={onBack} />; break;
      case 'game': content = <Game initialTab={target.tab} onClose={onBack} />; break;
      case 'sector01': content = <Sector01 onClose={onBack} />; break;
      case 'pcb': content = <Pcb passport={passport} />; break;
      case 'live-bench': content = <LiveBench passport={passport} />; break;
    }
  }
  return <div className="space-y-4 py-4">
    <button type="button" onClick={onBack} className="px-4 py-2 rounded-xl border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 text-xs font-bold uppercase">← Volver a PRACTICAR</button>
    <h2 className="font-display text-lg font-black text-cyan-400 uppercase">{lab.title}</h2>
    <React.Suspense fallback={<p role="status" className="text-amber-400 text-sm py-10">Cargando laboratorio…</p>}>{content}</React.Suspense>
  </div>;
};
