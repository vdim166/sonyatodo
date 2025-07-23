import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useAppContext = () => {
  if (!AppContext) throw new Error('AppContext is not defined');

  return useContext(AppContext);
};
