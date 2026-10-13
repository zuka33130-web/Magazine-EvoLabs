import React from 'react';
import { EvoTomeExamEngine } from '../exam/EvoTomeExamEngine';

export interface FinalExamQuestion {
  id: string;
  category: string;
  prompt: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface EvoTomo02FinalExamProps {
  onBackToIndex: () => void;
  onCompleteExam: (score: number, total: number) => void;
  onGoToModule?: (moduleIndex: number) => void;
  onContinueToLab?: () => void;
  onBackToTomoCover?: () => void;
}

export const EvoTomo02FinalExam: React.FC<EvoTomo02FinalExamProps> = ({
  onBackToIndex,
  onCompleteExam,
  onGoToModule,
  onContinueToLab,
  onBackToTomoCover,
}) => {
  return (
    <EvoTomeExamEngine
      tomoId="tomo-02"
      onBackToIndex={onBackToIndex}
      onBackToTomoCover={onBackToTomoCover || onBackToIndex}
      onGoToModule={onGoToModule}
      onExamPassed={onCompleteExam}
      onContinueToLab={onContinueToLab}
    />
  );
};
