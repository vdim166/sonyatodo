import { useContext } from 'react';
import { ModalsContext } from '../contexts/ModalsContext';

export const useModalsContext = () => {
  if (!ModalsContext) throw new Error('ModalsContext is not defined');

  return useContext(ModalsContext);
};
