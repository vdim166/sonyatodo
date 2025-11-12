import { useContext } from 'react';
import { LongTermAffairsContext } from '../contexts/LongTermAffairsContext';

export const useLongTermAffairsContext = () => {
  return useContext(LongTermAffairsContext);
};
