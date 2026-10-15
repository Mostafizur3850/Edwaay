import React from 'react';
import { StudentMistakeItem } from '../../../types/types';
import { StudentHistory } from './StudentHistory';

interface MistakeBankProps {
  mistakes: StudentMistakeItem[];
  onResolveMistake: (id: string) => void;
  onAddMistake?: (mistake: StudentMistakeItem) => void;
  user?: any;
  subjects?: string[];
  goal?: string;
}

export const MistakeBank: React.FC<MistakeBankProps> = ({ 
  mistakes, 
  onResolveMistake, 
  onAddMistake,
  user,
  subjects,
  goal 
}) => {
  return (
    <StudentHistory 
      mistakes={mistakes} 
      onResolveMistake={onResolveMistake} 
      onAddMistake={onAddMistake}
      user={user}
      subjects={subjects}
      goal={goal}
    />
  );
};
