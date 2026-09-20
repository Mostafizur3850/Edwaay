import React from 'react';
import { StudentMistakeItem } from '../../../types/types';
import { StudentHistory } from './StudentHistory';

interface MistakeBankProps {
  mistakes: StudentMistakeItem[];
  onResolveMistake: (id: string) => void;
  onAddMistake?: (mistake: StudentMistakeItem) => void;
}

export const MistakeBank: React.FC<MistakeBankProps> = ({ mistakes, onResolveMistake }) => {
  return <StudentHistory mistakes={mistakes} onResolveMistake={onResolveMistake} />;
};
