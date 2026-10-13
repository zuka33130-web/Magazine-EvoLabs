import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_07_META, TOMO_07_CHAPTERS, TOMO_07_CASES, TOMO_07_GLOSSARY } from '../../data/tomo07Data';
import { EvoPerformanceMetrologyLab } from '../labs/tomo07/EvoPerformanceMetrologyLab';

interface Tomo07MasterPageProps {
  onBack?: () => void;
}

export const Tomo07MasterPage: React.FC<Tomo07MasterPageProps> = ({ onBack }) => {
  const [showLab, setShowLab] = useState(false);

  if (showLab) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto p-4">
        <EvoPerformanceMetrologyLab onClose={() => setShowLab(false)} />
      </div>
    );
  }

  return (
    <EvoTechnicalTomeReader
      tomeId="tomo-07"
      meta={TOMO_07_META}
      chapters={TOMO_07_CHAPTERS}
      cases={TOMO_07_CASES.map((c) => ({
        id: c.id,
        title: c.title,
        symptom: c.symptom,
        diagnosticLayer: c.methodologyApplied,
        telemetryMeasured: c.telemetryMeasured,
        discardedHypothesis: c.discardedHypothesis,
        rootCause: c.rootCause,
        fixAction: c.evidenceConclusion,
        verificationCmd: c.verificationMetric,
      }))}
      glossary={TOMO_07_GLOSSARY.map((g) => ({
        term: g.term,
        rfcOrStandard: g.metricOrStandard,
        definition: g.definition,
        practicalTip: g.measurementProtocol,
      }))}
      sources={TOMO_07_META.sources}
      themeColor={TOMO_07_META.themeColor}
      onBack={onBack}
      customLabAction={{
        label: 'PERFORMANCE METROLOGY LAB',
        onClick: () => setShowLab(true),
      }}
    />
  );
};
