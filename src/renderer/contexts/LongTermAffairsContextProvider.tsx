import { useState } from 'react';
import {
  LongTermAffairsContext,
  LongTermAffairsContextType,
} from './LongTermAffairsContext';

type LongTermAffairsContextProviderProps = {
  children: React.ReactNode;
};

export const LongTermAffairsContextProvider = ({
  children,
}: LongTermAffairsContextProviderProps) => {
  const [currentTab, setCurrentTab] = useState<'TODO' | 'DONE'>('TODO');

  const value: LongTermAffairsContextType = {
    currentTab,
    setTab: setCurrentTab,
  };

  return (
    <LongTermAffairsContext.Provider value={value}>
      {children}
    </LongTermAffairsContext.Provider>
  );
};
