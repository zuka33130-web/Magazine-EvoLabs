import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_05_META, TOMO_05_CHAPTERS, TOMO_05_CASES, TOMO_05_GLOSSARY } from '../../data/tomo05Data';
import { EvoNetworkForensicsLab } from '../labs/tomo05/EvoNetworkForensicsLab';

interface Tomo05MasterPageProps {
  onBack?: () => void;
}

export const Tomo05MasterPage: React.FC<Tomo05MasterPageProps> = ({ onBack }) => {
  const [showLab, setShowLab] = useState(false);

  if (showLab) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto p-4">
        <EvoNetworkForensicsLab onClose={() => setShowLab(false)} />
      </div>
    );
  }

  return (
    <EvoTechnicalTomeReader
      tomeId="tomo-05"
      meta={TOMO_05_META}
      chapters={TOMO_05_CHAPTERS}
      cases={TOMO_05_CASES}
      glossary={TOMO_05_GLOSSARY}
      sources={TOMO_05_META.sources}
      themeColor={TOMO_05_META.themeColor}
      onBack={onBack}
      customLabAction={{
        label: 'NETWORK FORENSICS LAB',
        onClick: () => setShowLab(true),
      }}
    />
  );
};
