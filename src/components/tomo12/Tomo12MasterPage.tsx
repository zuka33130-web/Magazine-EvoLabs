import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_12_META, TOMO_12_CHAPTERS, TOMO_12_CASE_STUDIES, TOMO_12_GLOSSARY } from '../../data/tomo12Data';
import { GameForgeStudio } from '../game-forge/GameForgeStudio';

interface Tomo12MasterPageProps {
  onBack?: () => void;
}

export const Tomo12MasterPage: React.FC<Tomo12MasterPageProps> = ({ onBack }) => {
  const [showStudio, setShowStudio] = useState(false);

  return (
    <>
      <EvoTechnicalTomeReader
        tomeId="tomo-12"
        meta={TOMO_12_META}
        chapters={TOMO_12_CHAPTERS}
        cases={TOMO_12_CASE_STUDIES}
        glossary={TOMO_12_GLOSSARY}
        sources={TOMO_12_META.sources}
        themeColor={TOMO_12_META.themeColor}
        onBack={onBack}
        customLabAction={{
          label: 'GAME FORGE STUDIO',
          onClick: () => setShowStudio(true),
        }}
      />

      {showStudio && <GameForgeStudio onClose={() => setShowStudio(false)} />}
    </>
  );
};
