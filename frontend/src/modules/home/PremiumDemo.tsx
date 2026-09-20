import React from 'react';
import { Dashboard } from '../dashboard/Dashboard';

export const PremiumDemo: React.FC = () => {
  return <Dashboard isDemoView={true} />;
};
