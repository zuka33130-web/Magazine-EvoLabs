import React from 'react';
import { EvoTomeExamEngine } from '../exam/EvoTomeExamEngine';

export interface FinalExamQuestion {
  id: number;
  chapterNumber: string;
  chapterTitle: string;
  topic: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    rationale: string;
  }[];
}

export interface EvoTomo01FinalExamProps {
  onBackToIndex: () => void;
  onGoToChapter: (chapterNumber: string) => void;
  onCompleteExam: (score: number, total: number) => void;
  onContinueToLab?: () => void;
  onBackToTomoCover?: () => void;
  onOpenCompletionScreen?: () => void;
}

export const EvoTomo01FinalExam: React.FC<EvoTomo01FinalExamProps> = ({
  onBackToIndex,
  onGoToChapter,
  onCompleteExam,
  onContinueToLab,
  onBackToTomoCover,
  onOpenCompletionScreen,
}) => {
  return (
    <EvoTomeExamEngine
      tomoId="tomo-01"
      onBackToIndex={onBackToIndex}
      onBackToTomoCover={onBackToTomoCover || onBackToIndex}
      onGoToChapter={onGoToChapter}
      onExamPassed={onCompleteExam}
      onContinueToLab={onContinueToLab}
      onOpenCompletionScreen={onOpenCompletionScreen}
    />
  );
};
