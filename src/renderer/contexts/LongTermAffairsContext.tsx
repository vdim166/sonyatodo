import { createContext } from 'react';

export type LongTermAffairsContextType = {
  currentTab: 'TODO' | 'DONE';
  setTab: React.Dispatch<React.SetStateAction<'TODO' | 'DONE'>>;
};

const init: LongTermAffairsContextType = {
  currentTab: 'TODO',
  setTab: () => {},
};

export const LongTermAffairsContext = createContext(init);
