import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_10_METADATA, TOMO_10_CHAPTERS, TOMO_10_CASE_STUDIES, TOMO_10_GLOSSARY, TOMO_10_SOURCES } from '../../data/tomo10Data';
import { EvoAiSystemsLab } from '../labs/tomo10/EvoAiSystemsLab';

interface Tomo10MasterPageProps {
  onBack?: () => void;
}

export const Tomo10MasterPage: React.FC<Tomo10MasterPageProps> = ({ onBack }) => {
  const [showLab, setShowLab] = useState(false);

  if (showLab) {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-y-auto p-4">
        <EvoAiSystemsLab onClose={() => setShowLab(false)} />
      </div>
    );
  }

  return (
    <EvoTechnicalTomeReader
      tomeId="tomo-10"
      meta={{
        number: TOMO_10_METADATA.number,
        title: TOMO_10_METADATA.title,
        subtitle: TOMO_10_METADATA.tagline,
        edition: TOMO_10_METADATA.edition,
        badge: 'INGENIERÍA DE PROMPTS, RAG & ARQUITECTURA DE AGENTES',
        themeColor: TOMO_10_METADATA.accentColor,
      }}
      chapters={TOMO_10_CHAPTERS}
      cases={TOMO_10_CASE_STUDIES}
      glossary={TOMO_10_GLOSSARY}
      sources={TOMO_10_SOURCES}
      themeColor={TOMO_10_METADATA.accentColor}
      onBack={onBack}
      customLabAction={{
        label: 'AI SYSTEMS LAB',
        onClick: () => setShowLab(true),
      }}
    />
  );
};
