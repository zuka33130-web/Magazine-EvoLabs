import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_09_META, TOMO_09_CHAPTERS, TOMO_09_CASES, TOMO_09_GLOSSARY } from '../../data/tomo09Data';
import { EvoCodeEngineeringLab } from '../labs/tomo09/EvoCodeEngineeringLab.tsx';

interface Tomo09MasterPageProps {
  onBack?: () => void;
}

export const Tomo09MasterPage: React.FC<Tomo09MasterPageProps> = ({ onBack }) => {
  const [showLab, setShowLab] = useState(false);

  if (showLab) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto p-4">
        <EvoCodeEngineeringLab onClose={() => setShowLab(false)} />
      </div>
    );
  }

  return (
    <EvoTechnicalTomeReader
      tomeId="tomo-09"
      meta={TOMO_09_META}
      chapters={TOMO_09_CHAPTERS}
      cases={TOMO_09_CASES.map((c) => ({
        id: c.id,
        title: c.title,
        symptom: c.problemScenario,
        diagnosticLayer: c.programmingApproach,
        telemetryMeasured: c.realWorldImpact,
        discardedHypothesis: c.commonPitfallAvoided,
        rootCause: 'Lógica algorítmica no determinista / falta de tipado estricto',
        fixAction: c.codeImplemented,
        verificationCmd: 'Tests Unitarios & Tipado TypeScript Verificado',
      }))}
      glossary={TOMO_09_GLOSSARY.map((g) => ({
        term: g.term,
        rfcOrStandard: g.specification,
        definition: g.definition,
        practicalTip: g.practicalTip,
      }))}
      sources={TOMO_09_META.sources}
      themeColor={TOMO_09_META.themeColor}
      onBack={onBack}
      customLabAction={{
        label: 'CODE ENGINEERING LAB',
        onClick: () => setShowLab(true),
      }}
    />
  );
};
