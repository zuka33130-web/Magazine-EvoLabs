import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_06_META, TOMO_06_CHAPTERS, TOMO_06_CASES, TOMO_06_GLOSSARY } from '../../data/tomo06Data';
import { EvoDefensiveSecurityLab } from '../labs/tomo06/EvoDefensiveSecurityLab';

interface Tomo06MasterPageProps {
  onBack?: () => void;
}

export const Tomo06MasterPage: React.FC<Tomo06MasterPageProps> = ({ onBack }) => {
  const [showLab, setShowLab] = useState(false);

  if (showLab) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto p-4">
        <EvoDefensiveSecurityLab onClose={() => setShowLab(false)} />
      </div>
    );
  }

  return (
    <EvoTechnicalTomeReader
      tomeId="tomo-06"
      meta={TOMO_06_META}
      chapters={TOMO_06_CHAPTERS}
      cases={TOMO_06_CASES.map((c) => ({
        id: c.id,
        title: c.title,
        symptom: c.symptom,
        diagnosticLayer: c.defenseTactic,
        telemetryMeasured: c.evidenceTelemetry,
        discardedHypothesis: c.discardedHypothesis,
        rootCause: c.rootCause,
        fixAction: c.remediationAction,
        verificationCmd: c.verificationCmd,
      }))}
      glossary={TOMO_06_GLOSSARY.map((g) => ({
        term: g.term,
        rfcOrStandard: g.standardOrOrg,
        definition: g.definition,
        practicalTip: g.defensiveApplication,
      }))}
      sources={TOMO_06_META.sources}
      themeColor={TOMO_06_META.themeColor}
      onBack={onBack}
      customLabAction={{
        label: 'DEFENSIVE SECURITY LAB',
        onClick: () => setShowLab(true),
      }}
    />
  );
};
